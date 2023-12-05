import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Table from "./components/Table";
import { axiosPost } from "../../Assets/api";

const API_BASE_URL = "http://localhost/hospital-managment-system/backend/api";
const USERS_API_URL = `${API_BASE_URL}/users/crud.php`;
const PATIENTS_API_URL = `${API_BASE_URL}/patients/crud.php`;

const AdminDashboard = () => {
  const [showDoctorsTable, setShowDoctorsTable] = useState(false);
  const [doctorsData, setDoctorsData] = useState(null);
  const [showPatientsTable, setShowPatientsTable] = useState(false);
  const [patientsData, setPatientsData] = useState(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const handleDoctorsClick = () => {
    setShowDoctorsTable(true);
    setShowPatientsTable(false);
    getDoctorsData();
  };

  const handlePatientsClick = () => {
    setShowDoctorsTable(false);
    setShowPatientsTable(true);
    getPatientsData();
  };

  const getDoctorsData = () => {
    fetchData(USERS_API_URL, "getAllUsers", null, setDoctorsData);
  };

  const getPatientsData = () => {
    fetchData(PATIENTS_API_URL, "getAllPatients", null, setPatientsData);
  };

  const fetchData = (url, action, key, setData) => {
    axiosPost(url, action, key, null)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleUserDelete = (rowDataItem) => {
    handleDelete(USERS_API_URL, "delete", "user_id", rowDataItem);
  };

  const handlePatientDelete = (rowDataItem) => {
    handleDelete(PATIENTS_API_URL, "delete", "patient_id", rowDataItem);
  };

  const handleDelete = (url, action, key, rowDataItem) => {
    axiosPost(url, action, key, rowDataItem[key]).then((res) => {
      if (url === USERS_API_URL) {
        getDoctorsData();
      } else if (url === PATIENTS_API_URL) {
        getPatientsData();
      }
    });
  };

  const handleuserEdit = (rowDataItem) => {
    handleEdit(USERS_API_URL, "update", "data", rowDataItem, getDoctorsData);
  };

  const handlePatientEdit = (rowDataItem) => {
    handleEdit(
      PATIENTS_API_URL,
      "update",
      "data",
      rowDataItem,
      getPatientsData
    );
  };

  const handleEdit = (url, action, key, rowDataItem, getData) => {
    axiosPost(url, action, key, rowDataItem).then((res) => {
      getData();
    });
  };

  const handleDoctorsAdd = (rowDataItem) => {
    handleAdd(USERS_API_URL, "create", "data", rowDataItem, getDoctorsData);
  };

  const handlePatientAdd = (rowDataItem) => {
    handleAdd(PATIENTS_API_URL, "create", "data", rowDataItem, getPatientsData);
  };

  const handleAdd = (url, action, key, rowDataItem, getData) => {
    axiosPost(url, action, key, rowDataItem).then((res) => {
      getData();
    });
  };

  const er_confirmation = (rowDataItem, answer) => {
    axiosPost(
      PATIENTS_API_URL,
      "er_confirmation",
      "patient_id",
      rowDataItem.patient_id,
      answer
    ).then((res) => {
      getPatientsData();
    });
  };

  const checkIfAdmin = () => {
    axiosPost(
      USERS_API_URL,
      "checkIfAdmin",
      "jwt",
      localStorage.getItem("jwt")
    ).then((res) => {
      if (res.status === false) {
        localStorage.removeItem("jwt");
        window.location.href = "/";
      } else {
        setShowAdminDashboard(true);
      }
    });
  };
  checkIfAdmin();
  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  return showAdminDashboard ? (
    <div>
      <Nav
        onDoctorsClick={handleDoctorsClick}
        onPatientClick={handlePatientsClick}
      />

      <div className="text-center">
        <h1>
          {showDoctorsTable
            ? "Doctors"
            : showPatientsTable
            ? "Patients"
            : "Admin Dashboard"}
        </h1>
        {showDoctorsTable && doctorsData && (
          <Table
            header_data={doctorsData.header_data}
            row_data={doctorsData.users}
            onDelete={handleUserDelete}
            onEdit={handleuserEdit}
            onAdd={handleDoctorsAdd}
            slice={3}
          />
        )}
        {showPatientsTable && patientsData && (
          <Table
            header_data={patientsData.header_data}
            row_data={patientsData.patients}
            room_data={patientsData.rooms}
            onDelete={handlePatientDelete}
            onEdit={handlePatientEdit}
            onAdd={handlePatientAdd}
            er_confirmation={er_confirmation}
            slice={3}
          />
        )}
      </div>
    </div>
  ) : null;
};

export default AdminDashboard;
