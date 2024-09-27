// src/components/RecurringOptions.js

/*import React from "react";
import useDataStore from "../../store/useDataStore";

const RecurringOptions = () => {
  // Use state from the useDateStore hook
  const {
    recurringPattern,
    setRecurringPattern,
    interval,
    setInterval,
    selectedWeekdays,
    setSelectedWeekdays,
    nthDay,
    setNthDay,
  } = useDataStore();

  const handlePatternChange = (event) => {
    setRecurringPattern(event.target.value);
  };

  const handleWeekdayToggle = (day) => {
    if (selectedWeekdays.includes(day)) {
      setSelectedWeekdays(
        selectedWeekdays.filter((weekday) => weekday !== day)
      );
    } else {
      setSelectedWeekdays([...selectedWeekdays, day]);
    }
  };

  return (
    <div className="recurrence-options p-4 border rounded-lg shadow-md">
      <label className="block mb-2 text-sm font-medium">
        Select Recurrence Pattern:
      </label>
      <select
        value={recurringPattern}
        onChange={handlePatternChange}
        className="mb-4 p-2 border rounded w-full"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      {/* Render additional options based on the selected pattern *
      {recurringPattern === "daily" && (
        <div className="mt-4">
          <label>Every:</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value))}
            min="1"
            className="ml-2 p-1 border rounded w-20"
          />
          <span> days</span>
        </div>
      )}

      {recurringPattern === "weekly" && (
        <div className="mt-4">
          <label>Every:</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value))}
            min="1"
            className="ml-2 p-1 border rounded w-20"
          />
          <span> weeks on </span>
          <div className="flex space-x-2 mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <button
                key={day}
                onClick={() => handleWeekdayToggle(day)}
                className={`p-2 border rounded ${
                  selectedWeekdays.includes(day)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {recurringPattern === "monthly" && (
        <div className="mt-4">
          <label>The:</label>
          <select
            value={nthDay}
            onChange={(e) => setNthDay(parseInt(e.target.value))}
            className="ml-2 p-2 border rounded"
          >
            {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <span> day of every month</span>
        </div>
      )}

      {recurringPattern === "yearly" && (
        <div className="mt-4">
          <label>Every:</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value))}
            min="1"
            className="ml-2 p-1 border rounded w-20"
          />
          <span> years</span>
        </div>
      )}
    </div>
  );
};

export default RecurringOptions;
*/

import React, { useState, useEffect } from "react";
import useDataStore from "../../store/useDataStore";
import {
  isSameDay,
  addMonths,
  addDays,
  addYears,
  startOfMonth,
  getDay,
  addWeeks,
} from "date-fns";

const RecurringOptions = () => {
  const {
    recurringPattern,
    setRecurringPattern,
    interval,
    setInterval,
    selectedWeekdays,
    setSelectedWeekdays,
    nthDay,
    setNthDay,
    nthWeek,
    setNthWeek,
    selectedWeekday,
    setSelectedWeekday,
    startDate,
    endDate,
    setHighlightedDates, // NEW: Store highlighted dates to reflect in the calendar
  } = useDataStore();

  const [highlightedDates, updateHighlightedDates] = useState([]);

  const handlePatternChange = (event) => {
    setRecurringPattern(event.target.value);
  };

  const handleWeekdayToggle = (day) => {
    if (selectedWeekdays.includes(day)) {
      setSelectedWeekdays(
        selectedWeekdays.filter((weekday) => weekday !== day)
      );
    } else {
      setSelectedWeekdays([...selectedWeekdays, day]);
    }
  };

  const calculateMonthlyDates = () => {
    let dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      const firstOfMonth = startOfMonth(currentDate);
      let targetDate;

      // Calculate nth weekday of the month (e.g., 1st Monday)
      const firstWeekdayOfMonth = getDay(firstOfMonth); // get the day of the week for the first day of the month
      const targetWeekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(selectedWeekday);

      if (firstWeekdayOfMonth <= targetWeekday) {
        targetDate = addDays(
          firstOfMonth,
          targetWeekday - firstWeekdayOfMonth + (nthWeek - 1) * 7
        );
      } else {
        targetDate = addDays(
          firstOfMonth,
          7 - (firstWeekdayOfMonth - targetWeekday) + (nthWeek - 1) * 7
        );
      }

      if (targetDate <= endDate) {
        dates.push(targetDate);
      }

      currentDate = addMonths(currentDate, interval || 1); // move to next month with defined interval
    }

    return dates;
  };

  const calculateWeeklyDates = () => {
    let dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      selectedWeekdays.forEach((day) => {
        const targetWeekday = [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun",
        ].indexOf(day);
        const dateOfTargetWeekday = addDays(
          currentDate,
          targetWeekday - getDay(currentDate)
        );
        if (
          dateOfTargetWeekday <= endDate &&
          dateOfTargetWeekday >= startDate
        ) {
          dates.push(dateOfTargetWeekday);
        }
      });

      currentDate = addWeeks(currentDate, interval || 1); // move to next week with defined interval
    }

    return dates;
  };

  const calculateDailyDates = () => {
    let dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, interval || 1); // move to next day based on interval
    }

    return dates;
  };

  const calculateYearlyDates = () => {
    let dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate);
      currentDate = addYears(currentDate, interval || 1); // move to next year with defined interval
    }

    return dates;
  };

  const updateDates = () => {
    let dates = [];

    switch (recurringPattern) {
      case "daily":
        dates = calculateDailyDates();
        break;
      case "weekly":
        dates = calculateWeeklyDates();
        break;
      case "monthly":
        dates = calculateMonthlyDates();
        break;
      case "yearly":
        dates = calculateYearlyDates();
        break;
      default:
        break;
    }

    //updateHighlightedDates(dates);
    setHighlightedDates(dates); // Store the dates to highlight on the calendar
  };

  useEffect(() => {
    if (startDate && endDate) {
      updateDates();
    }
  }, [
    recurringPattern,
    startDate,
    endDate,
    interval,
    nthDay,
    nthWeek,
    selectedWeekdays,
    selectedWeekday,
  ]);

  return (
    <div className="recurrence-options p-4 border rounded-lg shadow-md">
      <label className="block mb-2 text-sm font-medium">
        Select Recurrence Pattern:
      </label>
      <select
        value={recurringPattern}
        onChange={handlePatternChange}
        className="mb-4 p-2 border rounded w-full"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      {recurringPattern === "daily" && (
        <div className="mt-4">
          <label>Every:</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value))}
            min="1"
            className="ml-2 p-1 border rounded w-20"
          />
          <span> days</span>
        </div>
      )}

      {recurringPattern === "weekly" && (
        <div className="mt-4">
          <label>Every:</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value))}
            min="1"
            className="ml-2 p-1 border rounded w-20"
          />
          <span> weeks on </span>
          <div className="flex space-x-2 mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <button
                key={day}
                onClick={() => handleWeekdayToggle(day)}
                className={`p-2 border rounded ${
                  selectedWeekdays.includes(day)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {recurringPattern === "monthly" && (
        <div className="mt-4">
          <label>On the:</label>
          <select
            value={nthWeek}
            onChange={(e) => setNthWeek(parseInt(e.target.value))}
            className="ml-2 p-2 border rounded"
          >
            {[1, 2, 3, 4, 5].map((week) => (
              <option key={week} value={week}>
                {week === 1 ? `${week}st` : `${week}th`}
              </option>
            ))}
          </select>

          <select
            value={selectedWeekday}
            onChange={(e) => setSelectedWeekday(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <span> of every month</span>
        </div>
      )}

      {recurringPattern === "yearly" && (
        <div className="mt-4">
          <label>Every:</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value))}
            min="1"
            className="ml-2 p-1 border rounded w-20"
          />
          <span> years</span>
        </div>
      )}
    </div>
  );
};

export default RecurringOptions;
