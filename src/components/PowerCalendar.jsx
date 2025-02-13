import {useEffect, useRef, useState} from "react";
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
    isSameDay,
    differenceInDays, getMonth,
} from "date-fns";
import "./power-calendar-styles.css";

const PowerCalendar = ({value = [null, null], onChange}) => {
    const today = new Date(); // Store today's date
    const [currentDate, setCurrentDate] = useState(today);
    const [viewMode, setViewMode] = useState("calendar");
    const [startDate, setStartDate] = useState(value[0]);
    const [endDate, setEndDate] = useState(value[1]);
    const dayGrid = useRef(null);

    const months = [
        "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
        "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
    ];
    const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

    const currentYear = currentDate.getFullYear();
    const years = Array.from({ length: 12 }, (_, i) => currentYear - 6 + i);

    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const handleMonthClick = (index) => {
        setCurrentDate(setMonth(currentDate, index));
        setViewMode("calendar");
    };

    const handleYearClick = (year) => {
        setCurrentDate(setYear(currentDate, year));
        setViewMode("month");
    };

    const goToToday = () => setCurrentDate(today);

    const onDayClick = (e) => {
        if (e.getMonth() === currentDate.getMonth()){
            if (!startDate){
                setStartDate(e)
            }else{
                if(!endDate){
                    if(e.getDate()<startDate.getDate()){
                        setStartDate(e)
                    }else if(e.getDate()> startDate.getDate()){
                        setEndDate(e)
                    }
                }else {
                    if (e.getDate()>startDate.getDate() && e.getDate()<endDate.getDate()){
                        if(differenceInDays(e,startDate)<=differenceInDays(endDate,e)){
                            setStartDate(e)
                        }else setEndDate(e)
                    }else{
                        setStartDate(e)
                        setEndDate(null)
                    }
                }
            }
        }
    }
    useEffect(() => {onChange([startDate, endDate]);},[startDate, endDate]);


    const isInRange = (start, end,value) => value > start && value < end;

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const daysArray = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
        <div className="power-calendar">
            <div className="calendar-header">
                <div
                    className="header-text"
                    onClick={() => setViewMode(viewMode === "calendar" ? "month" : "year")}
                >
                    {viewMode === "calendar" ? months[getMonth(currentDate)] + " " + format(currentDate, "yyyy") :
                        viewMode === "month" ? format(currentDate, "yyyy") : ""}
                </div>
                {viewMode === "calendar" && <button className='btn' onClick={prevMonth}>‹</button>}
                {viewMode === "calendar" &&<button className="btn" onClick={goToToday}>Today</button>}
                {viewMode === "calendar"  && <button className='btn' onClick={nextMonth}>›</button>}
            </div>


            <div className="calendar-body">

                {viewMode === "year" && (
                    <div className="year-select">
                        {years.map((year) => (
                            <div key={year} className="year-option" onClick={() => handleYearClick(year)}>
                                {year}
                            </div>
                        ))}
                    </div>
                )}


                {viewMode === "month" && (
                    <div className="month-select">
                        {months.map((month, index) => (
                            <div key={month} className="month-option" onClick={() => handleMonthClick(index)}>
                                {month}
                            </div>
                        ))}
                    </div>
                )}


                {viewMode === "calendar" && (
                    <>

                        <div className="calendar-weekdays">
                            {weekdays.map((day) => (
                                <div key={day} className="weekday">
                                    {day}
                                </div>
                            ))}
                        </div>


                        <div ref={dayGrid} className="calendar-grid">
                            {daysArray.map((day, index) => (
                                <div
                                    onClick={()=>onDayClick(day)}
                                    key={index}
                                    className={`day ${
                                        isSameDay(day, today) ? "selected" : ""
                                    } 
                                    ${day.getMonth() !== monthStart.getMonth() ? "inactive" : ""}
                                    ${startDate && isSameDay(day, startDate) ? "start-date" : ""}
                                    ${startDate && !endDate  ? "" : " start-date-back"}
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
        </div>
    );
};

export default PowerCalendar;