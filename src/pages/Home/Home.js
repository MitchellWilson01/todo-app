import React, { useState, useEffect } from 'react';
import { firestore } from '../../firebase';
import AddTask from '../../components/Widgets/AddTask/AddTask';
import './Home.scss';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [target, setTarget] = useState();
    
    const ref = firestore.collection("tasks");
    const groupsRef = firestore.collection("groups");

    const getGroups = () => {
        setLoading(true);
        let strGroups = []
        groupsRef.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });

            for (var key in items) {
                if (items.hasOwnProperty(key)) {
                    strGroups.push(JSON.stringify(items[key].name).slice(1, -1));
                }
            }
            setGroups(strGroups);
            setLoading(false);
        });
    }

    const getTasks = () => {
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });

            let am = [];
            let pm = [];
            items.forEach(item => {
                console.log(item.time);
                if (item.time[item.time.length - 2] === "A") {
                    am.push(item.time);
                    console.log("A" + " " + item.time);
                } else {
                    pm.push(item.time);
                    console.log("P" + " " + item.time);
                }
            });
            console.log(am);
            console.log(pm);
            setTasks(items);
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

    const toggleComplete = (updatedTask) => {
        setLoading();
        ref
          .doc(updatedTask.id)
          .update(updatedTask)
          .catch((err) => {
            console.error(err);
          });
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

    useEffect(() => {
        getTasks();
        getGroups();
    }, []);

    return (
        <div className="home">
            <div className="heading">
                <h3>My Day</h3>
                <i className="fas fa-plus-square" onClick={e => setAdding(true)}></i>
            </div>
            {adding ? <AddTask callback={addTaskCallback} groups={groups}/> : null}
            {
                tasks.map((task) => (
                    <div key={task.title} className={task.important ? "task important-task" : "task"}>
                        {task.completed == true ? 
                        <i className="fas fa-circle complete" onClick={e => toggleComplete({
                            title: task.title, 
                            time: task.time, 
                            important: task.important, 
                            group: task.group, 
                            id: task.id,
                            date: task.date,
                            completed: !task.completed,
                        })}><i className="fas fa-check"></i></i> 

                        : <i className="fas fa-circle incomplete" onClick={e => toggleComplete({
                            title: task.title, 
                            time: task.time, 
                            important: task.important, 
                            group: task.group, 
                            id: task.id,
                            date: task.date,
                            completed: !task.completed,
                        })}></i>}

                        <div>
                            <i className={task.important ? "far fa-bell important-bell" : "far fa-bell"} onClick={e => toggleImportant({
                                title: task.title, 
                                time: task.time, 
                                important: !task.important, 
                                group: task.group, 
                                id: task.id,
                                date: task.date,
                                completed: task.completed,
                            })}></i>
                            <i className="fas fa-trash-alt" onClick={e => setRemovingHelper(task.id)}></i>
                            <h4>{task.title}</h4>
                            <p>
                                <i className="far fa-folder-open"></i> {task.group}
                                <span><i className="far fa-clock"></i> {task.time}</span>
                            </p>
                            {removing && target === task.id ? startRemove(task) : null}
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default Home;