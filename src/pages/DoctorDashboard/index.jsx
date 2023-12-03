import { useEffect, useState } from "react";
import Nav from "./Nav";
import Table from "./Table";
import Calendar from "./Calendar";
const DoctorDashboard = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPatients, setShowPatients] = useState(false);
  const onCalendarClick = () => {
    setShowCalendar(true);
    setShowPatients(false);
  };
  const onPatientsClick = () => {
    setShowPatients(true);
    setShowCalendar(false);
  };
  useEffect(() => {
    document.title = "Doctor Dashboard";
  }, []);

  return (
    <div>
      <Nav
        onCalendarClick={onCalendarClick}
        onPatientsClick={onPatientsClick}
      />
      <h1>Doctor Dashboard</h1>
      {showCalendar && <Calendar />}
      {showPatients && <Table />}
    </div>
  );
};

export default DoctorDashboard;
