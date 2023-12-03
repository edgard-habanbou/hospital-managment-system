import "./styles.css";
const Table = ({ header_data, row_data, onDelete, onEdit, slice }) => {
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
              {Object.values(rowDataItem)
                .slice(slice)
                .map((item, colIndex) => (
                  <td key={colIndex}>{item}</td>
                ))}
              <td>
                <div className="flex gap">
                  <div>
                    <button
                      className="btn danger"
                      onClick={() => onDelete(rowDataItem)}
                    >
                      Delete
                    </button>
                  </div>
                  <div>
                    <button className="btn" onClick={() => onEdit(rowDataItem)}>
                      Edit
                    </button>
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
