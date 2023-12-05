import React, { useEffect, useState } from "react";
import { axiosPost } from "../../../../Assets/api";

import { setHours, setMinutes } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

const MyCalendar = () => {
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

  const [appointmentDateStart, setAppointmentDateStart] = useState(new Date());
  const [appointmentDateEnd, setAppointmentDateEnd] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patients, setPatients] = useState([]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    return `${month}-${day}-${year} ${hours}:${minutes}`;
  };

  const handleAddEvent = () => {
    console.log("Start Date:", formatDate(appointmentDateStart));
    console.log("End Date:", formatDate(appointmentDateEnd));
    console.log("Selected Patient:", selectedPatient);
  };

  useEffect(() => {
    const API_BASE_URL =
      "http://localhost/hospital-managment-system/backend/api";
    const PATIENTS_API_URL = `${API_BASE_URL}/patients/crud.php`;

    const getPatients = () => {
      axiosPost(PATIENTS_API_URL, "getAllPatients").then((response) => {
        setPatients(response.data.patients);
      });
    };
    getPatients();
  }, []);
  return (
    <div className=" calendar-wrapper">
      <div className="calendar">
        <div className="timeline">
          <div className="spacer"></div>
          <div className="time-marker">8 AM</div>
          <div className="time-marker">9 AM</div>
          <div className="time-marker">10 AM</div>
          <div className="time-marker">11 AM</div>
          <div className="time-marker">12 PM</div>
          <div className="time-marker">1 PM</div>
          <div className="time-marker">2 PM</div>
          <div className="time-marker">3 PM</div>
          <div className="time-marker">4 PM</div>
          <div className="time-marker">5 PM</div>
        </div>
        <div className="days">
          <div className="day mon">
            <div className="date">
              <p className="date-num">9</p>
              <p className="date-day">Mon</p>
            </div>
            <div className="events">
              <div className="event start-8 end-9 securities">
                <p className="title">Securities Regulation</p>
                <p className="time">2 PM - 5 PM</p>
              </div>
            </div>
          </div>
          <div className="day tues">
            <div className="date">
              <p className="date-num">12</p>
              <p className="date-day">Tues</p>
            </div>
            <div className="events">
              <div className="event start-10 end-12 corp-fi">
                <p className="title">Corporate Finance</p>
                <p className="time">10 AM - 12 PM</p>
              </div>
              <div className="event start-1 end-4 ent-law">
                <p className="title">Entertainment Law</p>
                <p className="time">1PM - 4PM</p>
              </div>
            </div>
          </div>
          <div className="day wed">
            <div className="date">
              <p className="date-num">11</p>
              <p className="date-day">Wed</p>
            </div>
            <div className="events">
              <div className="event start-11 end-12 writing">
                <p className="title">Writing Seminar</p>
                <p className="time">11 AM - 12 PM</p>
              </div>
              <div className="event start-2 end-5 securities">
                <p className="title">Securities Regulation</p>
                <p className="time">2 PM - 5 PM</p>
              </div>
            </div>
          </div>
          <div className="day thurs">
            <div className="date">
              <p className="date-num">12</p>
              <p className="date-day">Thurs</p>
            </div>
            <div className="events">
              <div className="event start-10 end-12 corp-fi">
                <p className="title">Corporate Finance</p>
                <p className="time">10 AM - 12 PM</p>
              </div>
              <div className="event start-1 end-4 ent-law">
                <p className="title">Entertainment Law</p>
                <p className="time">1PM - 4PM</p>
              </div>
            </div>
          </div>
          <div className="day fri">
            <div className="date">
              <p className="date-num">13</p>
              <p className="date-day">Fri</p>
            </div>
            <div className="events"></div>
          </div>
        </div>
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

export default MyCalendar;
