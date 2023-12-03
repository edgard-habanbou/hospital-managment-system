import React, { useState } from "react";
import "./styles.css";

const Table = ({ header_data, row_data, onDelete, onEdit, onAdd, slice }) => {
  const [editIndex, setEditIndex] = useState(-1);
  const [editedRow, setEditedRow] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRow, setNewRow] = useState({});

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
    setShowAddForm(false);
    setNewRow({});
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setNewRow({});
  };

  const handleAddSaveClick = () => {
    const updatedRowData = [newRow];
    onAdd(updatedRowData[0]);
    setNewRow({});
    setShowAddForm(false);
  };

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {showAddForm && header_data.includes("Password") && (
              <th>Password</th>
            )}
            {header_data
              .slice(header_data.includes("Password") ? 1 : 0)
              .map((item, index) => (
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
              {showAddForm && header_data.includes("Password") && <td></td>}

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
                      className="btn"
                      onClick={() => handleEditClick(rowDataItem, rowIndex)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => onDelete(rowDataItem)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {showAddForm && (
            <tr>
              {Object.keys(row_data[0])

                .slice(
                  showAddForm && header_data.includes("Password")
                    ? slice - 1
                    : slice
                )
                .map((key, colIndex) => (
                  <td key={colIndex}>
                    <input
                      className="input"
                      type="text"
                      value={newRow[key] || ""}
                      onChange={(e) =>
                        setNewRow({
                          ...newRow,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </td>
                ))}
              <td>
                <div className="flex gap">
                  <button className="btn" onClick={handleAddSaveClick}>
                    Save
                  </button>
                  <button className="btn danger" onClick={handleCancelClick}>
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!showAddForm && (
        <div className="add-button-container">
          <button className="btn" onClick={handleAddClick}>
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
