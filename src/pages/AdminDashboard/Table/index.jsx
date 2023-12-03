import "./styles.css";
const Table = ({ header_data, row_data }) => {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {header_data.map((item, index) => (
              <th key={index} className="col-control">
                {item}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {row_data.map((rowDataItem, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(rowDataItem).map((item, colIndex) => (
                <td key={colIndex}>{item}</td>
              ))}
              <td>
                <div className="flex gap">
                  <div>
                    <button className="btn danger">Delete</button>
                  </div>
                  <div>
                    <button className="btn">Edit</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
