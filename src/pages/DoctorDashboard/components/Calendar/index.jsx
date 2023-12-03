import { useEffect } from "react";
import "./styles.css";

const Calendar = () => {
  useEffect(() => {
    document.title = "Calendar";
  }, []);
  return (
    <div>
      <h1>Calendar</h1>
    </div>
  );
};

export default Calendar;
