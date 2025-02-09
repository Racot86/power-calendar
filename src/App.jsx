import { useState } from 'react'

import './App.css'
import PowerCalendar from "./components/PowerCalendar.jsx";

function App() {
    const [dates, setDates] = useState([new Date(),null]);
    return (
        <div>
            <h1>React Calendar</h1>
            <PowerCalendar onChange={setDates} />
            <p> {dates[0] && dates[0].toDateString()}-{dates[1] && dates[1].toDateString()}</p>
        </div>
    );
}

export default App
