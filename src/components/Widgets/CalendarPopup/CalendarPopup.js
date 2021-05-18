import React, { useContext } from 'react';
import { DateContext } from '../../../contexts/DateContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CalendarPopup.scss';

const CalendarPopup = () => {
    const { date, setDate } = useContext(DateContext);

    return (
        <div className="calendar-popup">
            <DatePicker 
                    className="datepicker"
                    selected={date} 
                    onChange={date => setDate(date)} 
                    closeOnScroll={true} 
                    popperPlacement="top-end" 
            />
        </div>
    );
}

export default CalendarPopup;