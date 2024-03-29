import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Table from "./components/Table";
import { axiosPost } from "../../Assets/api";
import AppointmentCalendar from "./components/AppointmentCalendar";

const DoctorDashboard = () => {
  if (!localStorage.getItem("jwt")) {
    window.location.href = "/";
  }
  const API_BASE_URL = "http://localhost/hospital-managment-system/backend/api";
  const PATIENTS_API_URL = `${API_BASE_URL}/patients/crud.php`;

  const [showCalendar, setShowCalendar] = useState(true);
  const [showPatients, setShowPatients] = useState(false);
  const [patientsData, setPatientsData] = useState(null);
  const [user_id, setUser_id] = useState();
  const [showDoctorDashboard, setShowDoctorDashboard] = useState(false);

  const onCalendarClick = () => {
    setShowCalendar(true);
    setShowPatients(false);
  };

  const onPatientsClick = () => {
    setShowPatients(true);
    setShowCalendar(false);
    getAllPatients();
  };

  const getAllPatients = () => {
    fetchData(PATIENTS_API_URL, "getAllPatients", null, setPatientsData);
  };

  const fetchData = (url, action, key, setData) => {
    axiosPost(url, action, key, null)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const checkIfDoctor = () => {
    axiosPost(
      PATIENTS_API_URL,
      "checkIfDoctor",
      "jwt",
      localStorage.getItem("jwt")
    ).then((res) => {
      if (res.status === false) {
        localStorage.removeItem("jwt");
        window.location.href = "/";
      } else {
        setUser_id(res.data.user_id);
        setShowDoctorDashboard(true);
      }
    });
  };
  checkIfDoctor();

  useEffect(() => {
    document.title = "Doctor Dashboard";
  }, []);

  return showDoctorDashboard ? (
    <div>
      <Nav
        onCalendarClick={onCalendarClick}
        onPatientsClick={onPatientsClick}
      />
      {showCalendar && <AppointmentCalendar user_id={user_id} />}
      {showPatients && <Table patientsData={patientsData} slice={4} />}
    </div>
  ) : (
    <div></div>
  );
};

export default DoctorDashboard;
