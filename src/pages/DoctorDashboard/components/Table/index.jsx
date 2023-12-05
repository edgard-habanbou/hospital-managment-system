import { useEffect, useState } from "react";
import Record from "../Records";
import { axiosPost } from "../../../../Assets/api";

const Table = ({ patientsData, slice }) => {
  const [showRecords, setShowRecords] = useState(false);
  const [rowDataItem, setrowDataItem] = useState(null);
  const API_BASE_URL = "http://localhost/hospital-managment-system/backend/api";

  const RECORDS_API_URL = `${API_BASE_URL}/records/crud.php`;
  const PATIENTS_API_URL = `${API_BASE_URL}/patients/crud.php`;
  const handleShowRecords = (rowDataItem) => {
    setShowRecords(true);
    setrowDataItem(rowDataItem);
  };
  const addRecord = (newRecord) => {
    axiosPost(RECORDS_API_URL, "create", "data", newRecord).then(
      (response) => {}
    );
  };
  const handleNeedER = (rowDataItem) => {
    console.log(rowDataItem);
    axiosPost(
      PATIENTS_API_URL,
      "need_er",
      "patient_id",
      rowDataItem.patient_id
    ).then((response) => {
      alert(response.data.message);
    });
  };
  useEffect(() => {
    document.title = "Patients";
  }, []);

  return (
    <div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              {patientsData?.header_data.map((item, index) => (
                <th key={index} className="col-control">
                  {item}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patientsData?.patients.map((rowDataItem, rowIndex) => (
              <tr key={rowIndex}>
                {Object.entries(rowDataItem)
                  .slice(slice)
                  .map(([key, value], colIndex) => (
                    <td className="text-center" key={colIndex}>
                      {value}
                    </td>
                  ))}
                <td>
                  <div className="flex gap">
                    <div>
                      <button
                        className="btn"
                        onClick={() => handleShowRecords(rowDataItem)}
                      >
                        Show Records
                      </button>
                    </div>
                    <div>
                      {!rowDataItem.need_emergency &&
                      !rowDataItem.in_emergency_room ? (
                        <button
                          className="btn danger"
                          onClick={() => handleNeedER(rowDataItem)}
                        >
                          Needs ER
                        </button>
                      ) : rowDataItem.need_emergency ? (
                        <p>Already Requested</p>
                      ) : (
                        <p>In Emergency Room</p>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {showRecords && rowDataItem ? (
          <Record rowDataItem={rowDataItem} onAdd={addRecord} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Table;
