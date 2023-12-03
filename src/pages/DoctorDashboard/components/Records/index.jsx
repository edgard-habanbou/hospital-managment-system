import { axiosPost } from "../../../../Assets/api";
import { useEffect, useState } from "react";

const Record = ({ rowDataItem }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const API_BASE_URL =
      "http://localhost/hospital-managment-system/backend/api";

    const RECORDS_API_URL = `${API_BASE_URL}/records/crud.php`;
    const getPatientRecords = () => {
      axiosPost(
        RECORDS_API_URL,
        "getRecordsbyPatientID",
        "patient_id",
        rowDataItem.patient_id
      ).then((response) => {
        setRecords(response.data.records);
      });
    };
    getPatientRecords();
  }, [rowDataItem.patient_id]);

  return (
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
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.record_id}>
              <td>{record.patient_fname + " " + record.patient_lname}</td>
              <td>{record.user_fname + record.user_lname}</td>
              <td>{record.diagnosis}</td>
              <td>{record.treatment}</td>
              <td>{record.record_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Record;
