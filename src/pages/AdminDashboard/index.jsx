import React, { useState } from "react";
import Nav from "./Nav";
import Table from "./Table";
import { axiosPost } from "../../Assets/api";

const AdminDashboard = () => {
  const [showDoctorsTable, setShowDoctorsTable] = useState(false);
  const [doctorsData, setDoctorsData] = useState(null);
  const [ShowPatientsTable, setShowPatientsTable] = useState(false);
  const [PatientsData, setPatientsData] = useState(null);

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
    axiosPost(
      "http://localhost/hospital-managment-system/backend/api/users/crud.php",
      "getAllUsers",
      null,
      null
    )
      .then((res) => {
        setDoctorsData(res.data);
      })
      .catch((err) => console.log(err));
  };
  const getPatientsData = () => {
    const url =
      "http://localhost/hospital-managment-system/backend/api/patients/crud.php";
    axiosPost(url, "getAllPatients", null, null)
      .then((res) => {
        setPatientsData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleUserDelete = (rowDataItem) => {
    axiosPost(
      "http://localhost/hospital-managment-system/backend/api/users/crud.php",
      "delete",
      "user_id",
      rowDataItem.user_id
    ).then((res) => {
      getDoctorsData();
    });
  };
  const handlePatientDelete = (rowDataItem) => {
    axiosPost(
      "http://localhost/hospital-managment-system/backend/api/patients/crud.php",
      "delete",
      "patient_id",
      rowDataItem.patient_id
    ).then((res) => {
      getPatientsData();
    });
  };
  const er_confirmation = (rowDataItem, answer) => {
    axiosPost(
      "http://localhost/hospital-managment-system/backend/api/patients/crud.php",
      "er_confirmation",
      "patient_id",
      rowDataItem.patient_id,
      answer
    ).then((res) => {
      getPatientsData();
    });
  };
  const handleuserEdit = (rowDataItem) => {
    axiosPost(
      "http://localhost/hospital-managment-system/backend/api/users/crud.php",
      "update",
      "data",
      rowDataItem
    ).then((res) => {
      getDoctorsData();
    });
  };
  const handleDoctorsAdd = (rowDataItem) => {
    axiosPost(
      "http://localhost/hospital-managment-system/backend/api/users/crud.php",
      "create",
      "data",
      rowDataItem
    ).then((res) => {
      getDoctorsData();
    });
  };
  const handlePatientAdd = (rowDataItem) => {
    axiosPost(
      "http://localhost/hospital-managment-system/backend/api/patients/crud.php",
      "create",
      "data",
      rowDataItem
    ).then((res) => {
      getPatientsData();
    });
  };

  const handlePatientEdit = (rowDataItem) => {
    axiosPost(
      "http://localhost/hospital-managment-system/backend/api/patients/crud.php",
      "update",
      "data",
      rowDataItem
    ).then((res) => {
      getPatientsData();
    });
  };
  return (
    <div>
      <Nav
        onDoctorsClick={handleDoctorsClick}
        onPatientClick={handlePatientsClick}
      />

      <div className="text-center">
        <h1>
          {showDoctorsTable
            ? "Doctors"
            : ShowPatientsTable
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
            slice={4}
          />
        )}
        {ShowPatientsTable && PatientsData && (
          <Table
            header_data={PatientsData.header_data}
            row_data={PatientsData.patients}
            room_data={PatientsData.rooms}
            onDelete={handlePatientDelete}
            onEdit={handlePatientEdit}
            onAdd={handlePatientAdd}
            er_confirmation={er_confirmation}
            slice={3}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
