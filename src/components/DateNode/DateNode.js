import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './DateNode.scss';

const DateNode = () => {
    //const [date, setDate] = useState(null);
    const location = useLocation();

    let now = new Date();
    let dd = String(now.getDate()).padStart(2, '0');
    let mm = String(now.getMonth() + 1).padStart(2, '0');
    let yyyy = now.getFullYear();
    let today = mm + '/' + dd + '/' + yyyy;

    //setDate(today);
    if (location.pathname === "/") {
        return (
            <div className="date-node">
                <h4>{today}</h4>
            </div>
        );
    } else {
        return <></>
    }
}

export default DateNode;