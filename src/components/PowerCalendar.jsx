import React, {useRef, useState} from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
    setMonth,
    setYear,
    eachDayOfInterval,
    isSameDay, differenceInDays, setDate,
} from "date-fns";
import "./power-calendar-styles.css";

const PowerCalendar = () => {
    const today = new Date(); // Store today's date
    const [currentDate, setCurrentDate] = useState(today);
    const [viewMode, setViewMode] = useState("calendar");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const dayGrid = useRef(null);

    // **Generate Months**
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // **Generate Years Dynamically**
    const currentYear = currentDate.getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

    // **Change Month**
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    // **Handle Month Selection**
    const handleMonthClick = (index) => {
        setCurrentDate(setMonth(currentDate, index));
        setViewMode("calendar");
    };

    // **Handle Year Selection**
    const handleYearClick = (year) => {
        setCurrentDate(setYear(currentDate, year));
        setViewMode("month");
    };

    // **Return to Today**
    const goToToday = () => setCurrentDate(today);

    const onDayClick = (e) => {
        if (!startDate && !endDate){
            setStartDate(e)
        }

        if (!startDate && endDate){
            setStartDate(e)
        }

        if (startDate && !endDate){
            setEndDate(e)
        }

        if (startDate && endDate){
            if (e===startDate || e===endDate) return
            if (e<startDate){
                setStartDate(e)
            }else if(e>endDate){
                setEndDate(e)
            }else if(e > startDate && e<=endDate ){
                if (differenceInDays(e,startDate)<=differenceInDays(endDate,e)){
                    setStartDate(e)
                }else (
                    setEndDate(e)
                )
            }
        }
        console.log('start', startDate,'end',endDate)
    }
    const onDayMouseEnter = (date) => {
        if (startDate && date<startDate){
            const days = dayGrid.current.children
            for (let day of days) {
                if (!day.classList.contains("inactive")) {
                    const cellDate = setDate(currentDate, Number(day.innerHTML));
                    if (date.getDate()===cellDate.getDate()) {
                        day.classList.add("path-start");
                    }else if(cellDate.getDate()>date.getDate() && cellDate.getDate()<=startDate.getDate()){
                        day.classList.remove("path-start");
                        day.classList.add("path-body");
                    }
                }
            }
        }
    }
    const onDayMouseLeave = () => {
        const days = dayGrid.current.children
        for (let day of days) {
            if (!day.classList.contains("inactive")) {
                day.classList.remove("path-start");
                day.classList.remove("path-body");
                day.classList.remove("path-end");
            }
        }
    }

    const isInRange = (start, end,value) => value > start && value < end;

    // **Generate Calendar Grid (Monday Start)**
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const daysArray = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
        <div className="power-calendar">
            {/* Header Controls */}
            <div className="calendar-header">
                {viewMode === "calendar" && <button onClick={prevMonth}>‹</button>}

                {/* Clickable Month & Year (Dynamic Overlay Switching) */}
                <div
                    className="header-text"
                    onClick={() => setViewMode(viewMode === "calendar" ? "month" : "year")}
                >
                    {viewMode === "calendar" ? format(currentDate, "MMMM yyyy") :
                        viewMode === "month" ? format(currentDate, "yyyy") : "Select Year"}
                </div>

                {viewMode === "calendar" && <button onClick={nextMonth}>›</button>}
            </div>

            {/* **Fixed-Size Content Wrapper (Prevents Jumping)** */}
            <div className="calendar-body">
                {/* **View Mode: Year Selection** */}
                {viewMode === "year" && (
                    <div className="year-select">
                        {years.map((year) => (
                            <div key={year} className="year-option" onClick={() => handleYearClick(year)}>
                                {year}
                            </div>
                        ))}
                    </div>
                )}

                {/* **View Mode: Month Selection** */}
                {viewMode === "month" && (
                    <div className="month-select">
                        {months.map((month, index) => (
                            <div key={month} className="month-option" onClick={() => handleMonthClick(index)}>
                                {month}
                            </div>
                        ))}
                    </div>
                )}

                {/* **View Mode: Calendar** */}
                {viewMode === "calendar" && (
                    <>
                        {/* Weekday Headers (Monday Start) */}
                        <div className="calendar-weekdays">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                <div key={day} className="weekday">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div ref={dayGrid} className="calendar-grid">
                            {daysArray.map((day, index) => (
                                <div
                                    onMouseEnter={()=>onDayMouseEnter(day)}
                                    onMouseLeave={onDayMouseLeave}
                                    onClick={()=>onDayClick(day)}
                                    key={index}
                                    className={`day ${
                                        isSameDay(day, today) ? "selected" : ""
                                    } 
                                    ${day.getMonth() !== monthStart.getMonth() ? "inactive" : ""}
                                    ${startDate && isSameDay(day, startDate) ? "start-date" : ""}
                                    ${endDate && isSameDay(day, endDate) ? "end-date" : ""}
                                    ${startDate && endDate && isInRange(startDate,endDate,day) ? "range" : ""}
                                    `}
                                >
                                    {format(day, "d")}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* **Today Button** */}
            <div className="calendar-footer">
                <button className="today-button" onClick={goToToday}>Today</button>
            </div>
        </div>
    );
};

export default PowerCalendar;