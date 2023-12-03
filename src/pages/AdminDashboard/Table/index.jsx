import React, { useState } from "react";
import "./styles.css";

const Table = ({ header_data, row_data, onDelete, onEdit, slice }) => {
  const [editIndex, setEditIndex] = useState(-1);
  const [editedRow, setEditedRow] = useState({});

  const handleEditClick = (rowDataItem, rowIndex) => {
    setEditIndex(rowIndex);
    setEditedRow({ ...rowDataItem });
  };

  const handleSaveClick = () => {
    const updatedRowData = [...row_data];
    updatedRowData[editIndex] = {
      ...updatedRowData[editIndex],
      ...editedRow,
    };
    onEdit(updatedRowData[editIndex]);
    setEditIndex(-1);
    setEditedRow({});
  };
  const handleCancelClick = () => {
    setEditIndex(-1);
    setEditedRow({});
  };

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
              {Object.entries(rowDataItem)
                .slice(slice)
                .map(([key, value], colIndex) => (
                  <td key={colIndex}>
                    {editIndex === rowIndex ? (
                      <input
                        className="input"
                        type="text"
                        value={
                          editedRow[key] !== undefined ? editedRow[key] : value
                        }
                        onChange={(e) =>
                          setEditedRow({
                            ...editedRow,
                            [key]: e.target.value,
                          })
                        }
                      />
                    ) : (
                      value
                    )}
                  </td>
                ))}
              <td>
                {editIndex === rowIndex ? (
                  <div className="flex gap">
                    <button className="btn" onClick={handleSaveClick}>
                      Save
                    </button>
                    <button className="btn danger" onClick={handleCancelClick}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap">
                    <button
                      className="btn danger"
                      onClick={() => onDelete(rowDataItem)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleEditClick(rowDataItem, rowIndex)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
