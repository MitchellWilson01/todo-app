import React, { useState, useContext } from 'react';
import { DateContext } from '../../../contexts/DateContext';
import { useAuth } from '../../../contexts/AuthContext';
import { v4 as uuidv4 } from "uuid";
import Dropdown from 'react-dropdown';
import './AddHabit.scss';


const AddHabit = (props) => {
    const [title, setTitle] = useState();
    const [group, setGroup] = useState(props.groups[0]);
    const [hour, setHour] = useState("12");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");
    const [groupSelected, setGroupSelected] = useState(false);

    const { date, setDate } = useContext(DateContext);

    const { currentUser } = useAuth();

    const periods = ["AM", "PM"];
    let hours = [];
    let minutes = [];

    for (let i = 1; i <=12; i++) {
        hours.push(i);
    }

    for (let i = 0; i <= 60; i++) {
        minutes.push(i);
    }

    hours = hours.map((hour) => {
        let str = hour.toString();
        if (str.length === 1) {
            str = "0" + str;
        } 

        return str;
    });
    
    minutes = minutes.map((min) => {
        let str = min.toString();
        if (str.length === 1) {
            str = "0" + str;
        }

        return str;
    });

    const getDateFromContext = () => {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();
        let today = mm + '/' + dd + '/' + yyyy;

        return today;
    }

    const setGroupHandler = (label) => {
        setGroup(label);
        setGroupSelected(true);
    }


    return (
        <div className="add-habit">
            <input type="text" placeholder="Title" autoFocus onChange={e => setTitle(e.target.value)}></input>

            <div className="time-select">
                <div className="container">
                    <Dropdown 
                        className="dropdown period" 
                        menuClassName="menu"
                        controlClassName="control"
                        options={periods} 
                        value={periods[0]} 
                        placeholder={periods[0]}
                        onChange={e => setPeriod(e.label)}
                        >
                    </Dropdown>
                </div>

                <div className="container">
                    <Dropdown 
                        className="dropdown" 
                        menuClassName="menu"
                        controlClassName="control"
                        options={minutes} 
                        value={minutes[0]} 
                        placeholder={minutes[0]} 
                        onChange={e => setMinute(e.label)}
                        >
                    </Dropdown>
                </div>

                <h4 className="colon">:</h4>

                <div className="container hour">
                    <Dropdown 
                        className="dropdown" 
                        menuClassName="menu"
                        controlClassName="control"
                        options={hours} 
                        value={hours[11]} 
                        placeholder={hours[11]}
                        onChange={e => setHour(e.label)}
                        >
                    </Dropdown>
                </div>

                <div className="group-select">
                    <Dropdown 
                        className="group-dropdown" 
                        menuClassName="group-menu"
                        controlClassName="group-control"
                        options={props.groups}  
                        placeholder="Group"
                        placeholderClassName={groupSelected ? "group-placeholder-selected" : "group-placeholder"}
                        onChange={e => setGroupHandler(e.label)}
                        >
                    </Dropdown>
                </div>
            </div>
            <button className="add" onClick={e => props.callback(
                {
                    title: title, 
                    time: hour + ":" + minute + " " + period,
                    important: false,
                    id: uuidv4(),
                    group: group,
                    date: getDateFromContext(),
                    completed: false,
                    progress: false,
                    user: currentUser.uid 
                }
            )}>Add
            </button>
        </div>
    );
}

export default AddHabit;