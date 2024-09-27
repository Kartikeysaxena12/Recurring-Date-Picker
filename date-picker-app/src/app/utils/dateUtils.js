// src/utils/dateUtils.js

import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  setDate,
  getDay,
  setDay,
  getDate,
} from "date-fns";

/**
 * Generates recurring dates based on the given options.
 * @param {Object} options
 * @param {Date} options.startDate - The start date of recurrence.
 * @param {Date} [options.endDate] - The optional end date of recurrence.
 * @param {string} options.pattern - The recurrence pattern: daily, weekly, monthly, yearly.
 * @param {number} options.interval - The interval for the recurrence.
 * @param {Array<string>} [options.weekdays] - Selected weekdays for weekly pattern.
 * @param {number} [options.nthDay] - The nth day for monthly pattern.
 * @returns {Array<Date>} - Array of recurring dates.
 */
export const generateRecurringDates = ({
  startDate,
  endDate = null,
  pattern,
  interval,
  weekdays = [],
  nthDay = 1,
}) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const maxIterations = 1000; // Prevent infinite loops
  let iterations = 0;

  while (endDate ? currentDate <= endDate : iterations < maxIterations) {
    switch (pattern) {
      case "daily":
        dates.push(new Date(currentDate));
        currentDate = addDays(currentDate, interval);
        break;

      case "weekly":
        if (weekdays.length === 0) {
          // If no weekdays selected, default to the startDate's day
          dates.push(new Date(currentDate));
        } else {
          weekdays.forEach((day) => {
            const dayNumber = getDayNumber(day); // Convert "Mon" to 1, etc.
            const nextDate = setDay(currentDate, dayNumber, {
              weekStartsOn: 0,
            });
            if (nextDate >= currentDate && (!endDate || nextDate <= endDate)) {
              dates.push(new Date(nextDate));
            }
          });
          currentDate = addWeeks(currentDate, interval);
        }
        break;

      case "monthly":
        const date = getDate(currentDate);
        if (date <= 31) {
          const nthDate = setDate(currentDate, nthDay);
          if (nthDate >= currentDate && (!endDate || nthDate <= endDate)) {
            dates.push(new Date(nthDate));
          }
        }
        currentDate = addMonths(currentDate, interval);
        break;

      case "yearly":
        dates.push(new Date(currentDate));
        currentDate = addYears(currentDate, interval);
        break;

      default:
        break;
    }

    iterations += 1;
    if (iterations >= maxIterations) break;
  }

  // Remove duplicates and sort
  const uniqueDates = Array.from(
    new Set(dates.map((date) => date.toISOString()))
  )
    .map((iso) => new Date(iso))
    .sort((a, b) => a - b);

  return uniqueDates;
};

/**
 * Converts weekday string to number.
 * @param {string} day - Three-letter weekday abbreviation (e.g., "Mon").
 * @returns {number} - Day number (0 = Sunday, 6 = Saturday).
 */
const getDayNumber = (day) => {
  const days = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return days[day] || 0;
};
