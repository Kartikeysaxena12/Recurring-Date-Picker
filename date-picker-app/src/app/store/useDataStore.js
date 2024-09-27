// src/store/useDateStore.js
import { create } from "zustand"; // Use named import instead of default import

const useDateStore = create((set) => ({
  startDate: null,
  endDate: null,
  recurringPattern: "daily",
  interval: 1, // Added
  selectedWeekdays: [], // Added
  nthDay: 1, // Added
  highlightedDates: [],
  setHighlightedDates: (dates) => set({ highlightedDates: dates }),

  setStartDate: (date) => set(() => ({ startDate: date })),
  setEndDate: (date) => set(() => ({ endDate: date })),
  setRecurringPattern: (pattern) => set(() => ({ recurringPattern: pattern })),
  setInterval: (interval) => set(() => ({ interval })),
  setSelectedWeekdays: (weekdays) =>
    set(() => ({ selectedWeekdays: weekdays })),
  setNthDay: (day) => set(() => ({ nthDay: day })),
}));

export default useDateStore;
