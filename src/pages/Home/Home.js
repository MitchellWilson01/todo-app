import React, { useState, useEffect, useContext } from 'react';
import { firestore } from '../../firebase';
import { DateContext } from '../../contexts/DateContext';
import { useAuth } from '../../contexts/AuthContext';
import AddTask from '../../components/Widgets/AddTask/AddTask';
import Header from '../../components/Header/Header';
import './Home.scss';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [target, setTarget] = useState();

    const { date, setDate } = useContext(DateContext);
    const { currentUser } = useAuth();
    
    const ref = firestore.collection("tasks");
    const groupsRef = firestore.collection("groups");

    const filterByUser = (groups) => {
        let usersGroups = [];
        groups.forEach((group) => {
            if (group.user === currentUser.uid) {
                usersGroups.push(group);
            }
        });

        return usersGroups;
    }

    const getGroups = () => {
        setLoading(true);
        groupsRef.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });

            let usersGroups = filterByUser(items);

            let strGroups = [];
            for (var key in usersGroups) {
                if (usersGroups.hasOwnProperty(key)) {
                    strGroups.push(JSON.stringify(usersGroups[key].name).slice(1, -1));
                }
            }
            setGroups(strGroups);
            setLoading(false);
        });
    }

    const getUsersTasks = (tasks) => {
        let usersTasks = [];
        tasks.forEach((task) => {
            if (task.user === currentUser.uid) {
                usersTasks.push(task);
            }
        });

        return usersTasks;
    }

    const sortByTime = (items) => {
       items.sort(function (a, b) {
        return new Date("1970/01/01 " + a.time) - new Date("1970/01/01 " + b.time);
        });;

        return items;
    }

    const getTodaysTasks = (tasks) => {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();
        let today = mm + '/' + dd + '/' + yyyy;

        let todaysTasks = [];
        tasks.forEach((task) => {
            if (task.date === today) {
                todaysTasks.push(task);
            }
        });

        return todaysTasks;
    }

    const getTasks = () => {
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            
            let usersTasks = getUsersTasks(items);
            let sortedTasks = sortByTime(usersTasks);
            let todaysTasks = getTodaysTasks(sortedTasks);
            setTasks(todaysTasks);
            setLoading(false);
        });
    }

    const addTaskCallback = (newTask) => {
        if (Object.keys(newTask).length !== 0) {
            ref
                .doc(newTask.id)
                .set(newTask)
                .catch((err) => {
                console.error(err);
                });
        }
        setAdding(false);
    }

    const deleteTask = (task) => {
        ref
            .doc(task.id)
            .delete()
            .catch((err) => {
            console.error(err);
            });

        setRemoving(false);
    }

    const changeTaskStage = (task) => {
        setLoading();

        let taskStyle = "";
        if (task.completed) {
            task.completed = false;
            task.progress = false;
        } else if (task.progress) {
            task.completed = true;
            task.progress = false;
        } else {
            task.progress = true;
        }

        ref
            .doc(task.id)
            .update(task)
            .catch((err) => {
                console.error(err);
            });
    }

    const getTaskStage = (task) => {
        let stage = "";
        if (task.completed) {
            stage = "complete";
        } else if (task.progress) {
            stage = "in-progress";
        } else {
            stage = "incomplete";
        }

        return stage;
    }

    const toggleImportant = (updatedTask) => {
        setLoading();
        ref
            .doc(updatedTask.id)
            .update(updatedTask)
            .catch((err) => {
                console.error(err);
            });
    }

    const startRemove = (task) => {
        return (
            <div className="start-remove">
                <button className="remove" onClick={e => deleteTask(task)}>Delete</button>
                <button className="cancel" onClick={e => setRemoving(false)}>Cancel</button>
            </div>
        );
    }

    const setRemovingHelper = (id) => {
        setTarget(id);
        setRemoving(true);
    }

    const adjustTimeForDisplay = (time) => {
        if (time[0] === "0") {
            time = time.substring(1);
        }

        return time;
    }

    useEffect(() => {
        getTasks();
        getGroups();
    }, [date]);

    return (
        <>
        <Header />
        <div className="home">
            <div className="heading">
                <h3>My Day</h3>
                <i className="fas fa-plus" onClick={e => setAdding(true)}></i>
            </div>
            
            {adding ? <AddTask callback={addTaskCallback} groups={groups}/> : null}
            {
                tasks.map((task) => (
                    <div key={task.id} className={task.important ? "task important-task" : "task"}>
                        <i className={"fas fa-circle" + " " + getTaskStage(task)} onClick={e => changeTaskStage(task)}>
                            {task.completed ? <i className="fas fa-check"></i> : null}
                        </i> 

                        <div>
                            <i className={task.important ? "far fa-bell important-bell" : "far fa-bell"} onClick={e => toggleImportant({
                                ...task, 
                                important: !task.important
                            })}></i>
                            <i className="fas fa-trash-alt" onClick={e => setRemovingHelper(task.id)}></i>
                            <h4>{task.title}</h4>
                            <p>
                                <i className="far fa-folder-open"></i> {task.group}
                                <span><i className="far fa-clock"></i> {adjustTimeForDisplay(task.time)}</span>
                            </p>
                            {removing && target === task.id ? startRemove(task) : null}
                        </div>
                    </div>
                ))
            }
        </div>
        </>
    );
}

export default Home;