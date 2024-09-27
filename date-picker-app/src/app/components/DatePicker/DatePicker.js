// src/components/DatePicker.js
"use client"; // Add this at the top

import React from "react";
import RecurringOptions from "./RecurringOptions";
import CalendarPreview from "./CalenderPreview";
import useDateStore from "../../store/useDataStore";
import { format } from "date-fns";

const DatePicker = () => {
  const { startDate, setStartDate, endDate, setEndDate } = useDateStore();

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value ? new Date(e.target.value) : null);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value ? new Date(e.target.value) : null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Recurring Date Picker</h2>

      {/* Start Date Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Start Date:</label>
        <input
          type="date"
          value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
          onChange={handleStartDateChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* End Date Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          End Date (Optional):
        </label>
        <input
          type="date"
          value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
          onChange={handleEndDateChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Recurring Options */}
      <RecurringOptions />

      {/* Calendar Preview */}
      <CalendarPreview />
    </div>
  );
};

export default DatePicker;
