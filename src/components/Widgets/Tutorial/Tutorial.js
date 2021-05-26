import React from 'react';
import './Tutorial.scss';


const Tutorial = (props) => {
    return (
        <div className="tutorial">
            <h3>Tutorial 
                <span>
                    <i className="fas fa-times-circle" onClick={e=> props.callback()}></i>
                </span>
            </h3>

            <p>This application is still being developed, but this tutorial will 
            show you how to use the features that have been added thus far.</p>

            <h4>Adding a Group</h4>
            <p>Each task will fall under a certain group. In the side menu you 
            click the "+" button to add a group. You can also click the "-" 
            button if you want to remove a group. Removing a group will not 
            remove your tasks for that group. So, you can add an accidentally  
            deleted group back and not lose your tasks.</p>

            <h4>Adding a Task</h4>
            <p>To add a task just click the "+" button near the top right of 
            your screen. You will give the task a name, a group, and a time and 
            then click "add". If you do not select a group then the first group 
            will be selected by default. To remove a task simply click the 
            trash can icon in the bottom right of any task and then click 
            "delete".</p>

            <h4>Managing a Task</h4>
            <p>You can click the circle that appears next to a task to change 
            the stage of completion that the task is in. Tasks go from 
            incomplete (yellow) to in progress (blue) and finally to complete 
            (green) with each click of the circle. Simply click on a completed 
            circle again to move the task back to incomplete.</p>
            <p>You also have the ability to mark a task as important. To toggle 
            this feature just click the bell icon in the top right of any task.</p>

            <h4>Coming Soon</h4>
            <p>The next features to be on the lookout for are habits and events. 
            Habits are recurring tasks that will automically add themselves to 
            your schedule for each day, week day, or weekend. Events are similar 
            to tasks but they cannot be completed and will have a page of their 
            own.</p>
        </div>
    );
}

export default Tutorial;