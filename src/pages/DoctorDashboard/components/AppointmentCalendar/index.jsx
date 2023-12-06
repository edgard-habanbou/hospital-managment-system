import React, { useEffect, useState } from "react";
import { axiosPost } from "../../../../Assets/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
const AppointmentCalendar = ({ user_id }) => {
  const API_BASE_URL = "http://localhost/hospital-managment-system/backend/api";
  const includeTimes = [
    setHours(setMinutes(new Date(), 0), 8),
    setHours(setMinutes(new Date(), 30), 8),
    setHours(setMinutes(new Date(), 0), 9),
    setHours(setMinutes(new Date(), 30), 9),
    setHours(setMinutes(new Date(), 0), 10),
    setHours(setMinutes(new Date(), 30), 10),
    setHours(setMinutes(new Date(), 0), 11),
    setHours(setMinutes(new Date(), 30), 11),
    setHours(setMinutes(new Date(), 0), 12),
    setHours(setMinutes(new Date(), 30), 12),
    setHours(setMinutes(new Date(), 0), 13),
    setHours(setMinutes(new Date(), 30), 13),
    setHours(setMinutes(new Date(), 0), 14),
    setHours(setMinutes(new Date(), 30), 14),
    setHours(setMinutes(new Date(), 0), 15),
    setHours(setMinutes(new Date(), 30), 15),
    setHours(setMinutes(new Date(), 0), 16),
    setHours(setMinutes(new Date(), 30), 16),
    setHours(setMinutes(new Date(), 0), 17),
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentDateStart, setAppointmentDateStart] = useState(new Date());
  const [appointmentDateEnd, setAppointmentDateEnd] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patients, setPatients] = useState([]);
  const [appointments, setAppts] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const getAppointmentsForDate = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);

    const formattedDate = nextDay.toISOString().split("T")[0]; // YYYY-MM-DD
    return appointments.filter(
      (appointment) =>
        appointment.start_date.includes(formattedDate) ||
        appointment.end_date.includes(formattedDate)
    );
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleAddEvent = () => {
    const APPOINTMENTS_API_URL = `${API_BASE_URL}/appointments/crud.php`;

    axiosPost(APPOINTMENTS_API_URL, "create", "data", {
      patient_id: selectedPatient,
      start_date: formatDate(appointmentDateStart),
      end_date: formatDate(appointmentDateEnd),
      user_id: user_id,
    }).then((response) => {
      setSelectedPatient("");
      setAppointmentDateStart(new Date());
      setAppointmentDateEnd(new Date());

      getAppointments();
    });
  };

  const PATIENTS_API_URL = `${API_BASE_URL}/patients/crud.php`;

  const getAppointments = () => {
    const APPOINTMENTS_API_URL = `${API_BASE_URL}/appointments/crud.php`;

    axiosPost(APPOINTMENTS_API_URL, "getAllAppointments").then((response) => {
      setAppts(response.data);
    });
  };
  useEffect(() => {
    const getPatients = () => {
      axiosPost(PATIENTS_API_URL, "getAllPatients").then((response) => {
        setPatients(response.data.patients);
      });
    };
    handleDateChange(new Date());
    getPatients();
    getAppointments();
  }, [PATIENTS_API_URL]);
  return (
    <div className="full-height full-width flex center column gap ">
      <div className="flex gap column">
        <Calendar onChange={handleDateChange} value={selectedDate} />
        <ul>
          {getAppointmentsForDate().map((appointment, index) => (
            <li key={index}>
              <strong>Time:</strong> {appointment.start_date.split("T")[1]} -{" "}
              {appointment.end_date.split("T")[1]}, <strong>Patient:</strong>{" "}
              {appointment.patient_fname} {appointment.patient_lname},{" "}
              <strong>User:</strong> {appointment.user_fname}{" "}
              {appointment.user_lname}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap column">
        <div>
          <h2>Add Appointment</h2>
        </div>
        <div className="flex gap">
          <div className="flex column">
            <label htmlFor="date_picker_start">Start Date:</label>

            <DatePicker
              id="date_picker_start"
              selected={appointmentDateStart}
              className="input"
              onChange={(date) => {
                setAppointmentDateStart(date);
              }}
              showTimeSelect
              includeTimes={includeTimes}
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <div className="flex column">
            <label htmlFor="date_picker_end">End Date:</label>

            <DatePicker
              id="date_picker_end"
              selected={appointmentDateEnd}
              className="input"
              onChange={(date) => {
                setAppointmentDateEnd(date);
              }}
              showTimeSelect
              includeTimes={includeTimes}
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <div className="flex column">
            <label htmlFor="event_name">Patient:</label>

            <select
              value={selectedPatient}
              className="input"
              onChange={(e) => {
                setSelectedPatient(e.target.value);
              }}
            >
              <option disabled value="">
                Select Patient
              </option>

              {patients?.map((patient, i) => (
                <option key={i} value={patient.patient_id}>
                  {patient.fname + " " + patient.lname}
                </option>
              ))}
            </select>
          </div>
          <div className="flex column right">
            <button className="btn" onClick={handleAddEvent}>
              Add Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
