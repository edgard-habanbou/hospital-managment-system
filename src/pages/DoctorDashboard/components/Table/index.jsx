import { useEffect, useState } from "react";
import Record from "../Records";

const Table = ({ patientsData, slice }) => {
  const [showRecords, setShowRecords] = useState(false);
  const [rowDataItem, setrowDataItem] = useState(null);

  const handleShowRecords = (rowDataItem) => {
    setShowRecords(true);
    setrowDataItem(rowDataItem);
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
                  <button
                    className="btn"
                    onClick={() => handleShowRecords(rowDataItem)}
                  >
                    Show Records
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {showRecords && rowDataItem ? <Record rowDataItem={rowDataItem} /> : ""}
      </div>
    </div>
  );
};

export default Table;
