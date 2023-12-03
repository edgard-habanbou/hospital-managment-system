import React, { useState } from "react";
import Nav from "./Nav";
import Table from "./Table";
import axios from "axios";

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
    axios
      .post(
        "http://localhost/hospital-managment-system/backend/api/users/crud.php",
        {
          action: "getAllUsers",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setDoctorsData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getPatientsData = () => {
    axios
      .post(
        "http://localhost/hospital-managment-system/backend/api/patients/crud.php",
        {
          action: "getAllPatients",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setPatientsData(response.data);
      })
      .catch((error) => {
        console.log(error);
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
          />
        )}
        {ShowPatientsTable && PatientsData && (
          <Table
            header_data={PatientsData.header_data}
            row_data={PatientsData.patients}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
