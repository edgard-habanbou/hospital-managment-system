import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

const MyCalendar = () => {
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  return (
    <div className="full-height full-width calendar-wrapper">
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
          <h2>Add Event</h2>
        </div>
        <div className="flex gap">
          <div className="flex column">
            <label for="date_picker">Date:</label>

            <DatePicker
              id="date_picker"
              className="input"
              selected={appointmentDate}
              onChange={(date) => {
                setAppointmentDate(date);
                console.log(date);
              }}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
            />
          </div>
          <div className="flex column">
            <label for="event_name">Event Name:</label>
            <input
              type="text"
              className="input"
              id="event_name"
              placeholder="Event Name"
            />
          </div>
          <div className="flex column right">
            <button className="btn">Add Event</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
