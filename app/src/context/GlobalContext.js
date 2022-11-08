/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable autofix/no-unused-vars */

import React from "react";

const GlobalContext = React.createContext({
    monthIndex: 0,
    setMonthIndex: (index) => {},
    smallCalendarMonth: 0,
    setSmallCalendarMonth: (index) => {},
    daySelected: null,
    setDaySelected: (day) => {},
    showEventModal: false,
    setShowEventModal: (state) => {},
    dispatchCalEvent: ({ type, payload }) => {},
    savedEvents: [],
    selectedEvent: null,
    setSelectedEvent: (state) => {},
    setLabels: (label) => {},
    labels: [],
    updateLabel: () => {},
    filteredEvents: [],
    setLoggedIn: (state) => {},
    loggedIn: false,
});

export default GlobalContext;
