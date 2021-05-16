import React, { useState, useEffect } from 'react';
import { firestore } from '../../../firebase';
import { v4 as uuidv4 } from "uuid";
import Dropdown from 'react-dropdown';
import './AddTask.scss';


const AddTask = (props) => {
    const [title, setTitle] = useState();
    const [group, setGroup] = useState();
    const [hour, setHour] = useState("12");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");
    const [groupSelected, setGroupSelected] = useState(false);

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

    return (
        <div className="add-task">
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
                        placeholderClassName={group ? "group-placeholder-selected" : "group-placeholder"}
                        onChange={e => setGroup(e.label)}
                        >
                    </Dropdown>
                </div>
            </div>
            <button className="cancel" onClick={e => props.callback({ })}>Cancel</button>
            <button className="add" onClick={e => props.callback(
                {
                    title: title, 
                    time: hour + ":" + minute + " " + period,
                    important: false,
                    id: uuidv4(),
                    group: group,
                    date: "01/01/2020",
                    completed: false
                }
            )}>Add
            </button>
        </div>
    );
}

export default AddTask;