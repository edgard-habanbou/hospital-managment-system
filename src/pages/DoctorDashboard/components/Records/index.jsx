import { axiosPost } from "../../../../Assets/api";
import { useEffect, useState } from "react";

const Record = ({ rowDataItem, onAdd }) => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRow, setNewRow] = useState({});
  const [recordAdded, setRecordAdded] = useState(false);

  const resetNewRow = () => {
    setNewRow({
      patient_id: rowDataItem.patient_id,
      patient: rowDataItem.fname + " " + rowDataItem.lname,
      doctor_id: "",
      diagnosis: "",
      treatment: "",
      record_date: "",
    });
  };

  const handleCancelClick = () => {
    setShowAddForm(false);
    resetNewRow();
  };

  const handleAddClick = () => {
    resetNewRow();

    setShowAddForm(true);
  };

  const handleAddSaveClick = () => {
    const updatedRowData = [newRow];
    onAdd(updatedRowData[0]);
    resetNewRow();
    setRecordAdded(!recordAdded);
    setShowAddForm(false);
  };
  useEffect(() => {
    const API_BASE_URL =
      "http://localhost/hospital-managment-system/backend/api";

    const RECORDS_API_URL = `${API_BASE_URL}/records/crud.php`;
    const USERS_API_URL = `${API_BASE_URL}/users/crud.php`;

    const getUsers = () => {
      axiosPost(USERS_API_URL, "getAllUsers").then((response) => {
        setIsLoading(false);
        setUsers(response.data.users);
      });
    };

    const getPatientRecords = () => {
      setIsLoading(true);
      axiosPost(
        RECORDS_API_URL,
        "getRecordsbyPatientID",
        "patient_id",
        rowDataItem.patient_id
      ).then((response) => {
        setIsLoading(false);
        setRecords(response.data.records);
      });
    };

    getPatientRecords();
    getUsers();
  }, [rowDataItem.patient_id, recordAdded]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div className="table-wrapper">
        <h2>Records Table</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Record Date</th>
              {showAddForm && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {records?.map((record, i) => (
              <tr key={i}>
                <td>{record.patient_fname + " " + record.patient_lname}</td>
                <td>{record.user_fname + " " + record.user_lname}</td>
                <td>{record.diagnosis}</td>
                <td>{record.treatment}</td>
                <td>{record.record_date}</td>
              </tr>
            ))}
            {showAddForm && (
              <tr>
                {Object.keys(newRow).map((key, i) =>
                  key !== "doctor_id" ? (
                    <td
                      key={i}
                      {...(key === "patient_id" ? { hidden: true } : {})}
                    >
                      <input
                        key={key}
                        {...(key === "patient" ? { disabled: true } : {})}
                        {...(key === "record_date"
                          ? { placeholder: Date(), disabled: true }
                          : {})}
                        type="text"
                        className="input"
                        value={newRow[key]}
                        onChange={(e) =>
                          setNewRow({
                            ...newRow,
                            [key]: e.target.value,
                          })
                        }
                      />
                    </td>
                  ) : (
                    <td key={i}>
                      <select
                        className="input"
                        value={newRow[key]}
                        onChange={(e) =>
                          setNewRow({
                            ...newRow,
                            [key]: e.target.value,
                          })
                        }
                      >
                        <option disabled value="">
                          Select Doctor
                        </option>

                        {users?.map((user, i) => (
                          <option key={i} value={user.user_id}>
                            {user.fname + " " + user.lname}
                          </option>
                        ))}
                      </select>
                    </td>
                  )
                )}
                <td>
                  <button className="btn" onClick={handleAddSaveClick}>
                    Save
                  </button>
                  <button className="btn danger" onClick={handleCancelClick}>
                    Cancel
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!showAddForm && (
        <div className="flex center">
          <button className="btn" onClick={handleAddClick}>
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default Record;
