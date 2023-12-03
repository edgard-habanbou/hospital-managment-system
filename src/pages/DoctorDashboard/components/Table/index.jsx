import "./styles.css";

const Table = ({ patientsData, slice }) => {
  return (
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
                <button className="btn">Show Records</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
