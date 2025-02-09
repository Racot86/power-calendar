import { useState } from 'react'

import './App.css'
import PowerCalendar from "./components/PowerCalendar.jsx";

function App() {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <div>
            <h1>React Calendar</h1>
            <PowerCalendar onSelectDate={setSelectedDate} />
            {selectedDate && <p>Selected Date: {selectedDate.toDateString()}</p>}
        </div>
    );
}

export default App
