// src/components/CalendarPreview.js
"use client"; // Add this at the top

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useDateStore from "../../store/useDataStore";
import { generateRecurringDates } from "../../utils/dateUtils";
import { format } from "date-fns";

const CalendarPreview = () => {
  const {
    startDate,
    endDate,
    recurringPattern,
    interval,
    selectedWeekdays,
    nthDay,
  } = useDateStore();

  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    if (startDate) {
      const dates = generateRecurringDates({
        startDate,
        endDate,
        pattern: recurringPattern,
        interval,
        weekdays: selectedWeekdays,
        nthDay,
      });
      setSelectedDates(dates);
    } else {
      setSelectedDates([]);
    }
  }, [
    startDate,
    endDate,
    recurringPattern,
    interval,
    selectedWeekdays,
    nthDay,
  ]);

  const formattedDates = selectedDates.map((date) =>
    format(new Date(date), "yyyy-MM-dd")
  );

  const tileContent = ({ date, view }) => {
    if (
      view === "month" &&
      formattedDates.includes(format(date, "yyyy-MM-dd"))
    ) {
      return (
        <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mt-1"></div>
      );
    }
    return null;
  };

  return (
    <div className="calendar-container p-4 border rounded-lg shadow-md bg-white">
      <Calendar tileContent={tileContent} />
    </div>
  );
};

export default CalendarPreview;
