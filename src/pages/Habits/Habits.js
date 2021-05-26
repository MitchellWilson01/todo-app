import React, { useState, useEffect, useContext } from 'react';
import { firestore } from '../../firebase';
import { DateContext } from '../../contexts/DateContext';
import { useAuth } from '../../contexts/AuthContext';
import AddHabit from '../../components/Widgets/AddHabit/AddHabit';
import Header from '../../components/Header/Header';
import './Habits.scss';

const Habits = () => {
    const [habits, setHabits] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [target, setTarget] = useState();

    const { date, setDate } = useContext(DateContext);
    const { currentUser } = useAuth();
    
    const ref = firestore.collection("habits");
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

    const getUsersHabits = (habits) => {
        let usersHabits = [];
        habits.forEach((habit) => {
            if (habit.user === currentUser.uid) {
                usersHabits.push(habit);
            }
        });

        return usersHabits;
    }

    const sortByTime = (items) => {
       items.sort(function (a, b) {
        return new Date("1970/01/01 " + a.time) - new Date("1970/01/01 " + b.time);
        });;

        return items;
    }

    const getTodaysHabits = (habits) => {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();
        let today = mm + '/' + dd + '/' + yyyy;

        let todaysHabits = [];
        habits.forEach((habit) => {
            if (habit.date === today) {
                todaysHabits.push(habit);
            }
        });

        return todaysHabits;
    }

    const getHabits = () => {
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            
            let usersHabits = getUsersHabits(items);
            let sortedHabits = sortByTime(usersHabits);
            //let todaysTasks = getTodaysTasks(sortedTasks);
            setHabits(sortedHabits);
            setLoading(false);
        });
    }

    const addHabitCallback = (newHabit) => {
        if (Object.keys(newHabit).length !== 0) {
            ref
                .doc(newHabit.id)
                .set(newHabit)
                .catch((err) => {
                console.error(err);
                });
        }
    }

    const deleteHabit = (habit) => {
        ref
            .doc(habit.id)
            .delete()
            .catch((err) => {
            console.error(err);
            });

        setRemoving(false);
    }

    const changeHabitStage = (habit) => {
        setLoading();

        let habitStyle = "";
        if (habit.completed) {
            habit.completed = false;
            habit.progress = false;
        } else if (habit.progress) {
            habit.completed = true;
            habit.progress = false;
        } else {
            habit.progress = true;
        }

        ref
            .doc(habit.id)
            .update(habit)
            .catch((err) => {
                console.error(err);
            });
    }

    const getHabitStage = (habit) => {
        let stage = "";
        if (habit.completed) {
            stage = "complete";
        } else if (habit.progress) {
            stage = "in-progress";
        } else {
            stage = "incomplete";
        }

        return stage;
    }

    const toggleImportant = (updatedHabit) => {
        setLoading();
        ref
            .doc(updatedHabit.id)
            .update(updatedHabit)
            .catch((err) => {
                console.error(err);
            });
    }

    const startRemove = (habit) => {
        return (
            <div className="start-remove">
                <button className="remove" onClick={e => deleteHabit(habit)}>Delete</button>
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
        getHabits();
        getGroups();
    }, [date]);


    return (
        <>
        <Header  active={1} />
        <div className="habits">
            <h3>Habits</h3>
            {/*
            <AddHabit callback={addHabitCallback} groups={groups} type="habit" />
            {
                habits.map((habit) => (
                    <div key={habit.id} className={habit.important ? "habit important-habit" : "habit"}>
                        <i className={"fas fa-circle" + " " + getHabitStage(habit)} onClick={e => changeHabitStage(habit)}>
                            {habit.completed ? <i className="fas fa-check"></i> : null}
                        </i> 

                        <div>
                            <i className={habit.important ? "far fa-bell important-bell" : "far fa-bell"} onClick={e => toggleImportant({
                                ...habit, 
                                important: !habit.important
                            })}></i>
                            <i className="fas fa-trash-alt" onClick={e => setRemovingHelper(habit.id)}></i>
                            <h4>{habit.title}</h4>
                            <p>
                                <i className="far fa-folder-open"></i> {habit.group}
                                <span><i className="far fa-clock"></i> {adjustTimeForDisplay(habit.time)}</span>
                            </p>
                            {removing && target === habit.id ? startRemove(habit) : null}
                        </div>
                    </div>
                ))
            }
            */}
        </div>
        </>
    );
}

export default Habits;