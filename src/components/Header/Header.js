import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory, useLocation } from 'react-router-dom';
import { firestore } from '../../firebase';
import { v4 as uuidv4 } from "uuid";
import CalendarPopup from '../Widgets/CalendarPopup/CalendarPopup';
import './Header.scss';

const Header = () => {
    const initialMobile = window.innerWidth < 768 ? true : false;
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const [groups, setGroups] = useState([]);
    const [name, setName] = useState();
    const [adding, setAdding] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState(initialMobile);

    const ref = firestore.collection("groups");

    const history = useHistory();
    const location = useLocation();

    const { currentUser, logout } = useAuth();

    const groupNameHandler = (e) => {
        setName(e.target.value);
    }

    const toggleDrawer = () => {
        setOpen(!open);
    }

    const handleLogout = async () => {
        try {
            await logout;
            history.push("/login");
        } catch {
            console.log("Failed to logout")
        }
    }

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
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });

            if (currentUser !== undefined) {
                const usersGroups = filterByUser(items);
                setGroups(usersGroups);
            } else {
                setGroups(items);
            }
            setLoading(false);
        });
    }

    const addGroup = (newGroup) => {
        ref
            .doc(newGroup.id)
            .set(newGroup)
            .catch((err) => {
            console.error(err);
            });
        
        setAdding(false);
    }

    const deleteGroup = (group) => {
        ref
            .doc(group.id)
            .delete()
            .catch((err) => {
            console.error(err);
            });

        setRemoving(false);
    }

    const beginAdd = () => {
        return (
            <div className="add-group">
                <input type="text" onChange={groupNameHandler} autoFocus></input>
                <button className="add" onClick={() => addGroup({  
                    id: uuidv4(),
                    name,
                    user: currentUser.uid
                })}>Add</button>
                <button className="cancel" onClick={() => setAdding(false)}>Cancel</button>
            </div>
        );
    }

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setMobile(true);
        } else {
            setMobile(false);
            setOpen(true);
        }
    }

    useEffect(() => {
        getGroups();

        if (!initialMobile && !mobile) {
            setOpen(true);
        }
    }, []);

    let now = new Date();
    let dd = String(now.getDate()).padStart(2, '0');
    let mm = String(now.getMonth() + 1).padStart(2, '0');
    let yyyy = now.getFullYear();
    let today = mm + '/' + dd + '/' + yyyy;

    window.addEventListener("resize", handleResize);

    if (location.pathname === "/") {
        return (
            <>
            <div className="header">
                <i className="fas fa-bars" onClick={mobile ? toggleDrawer : null}></i>
                <CalendarPopup />
            </div>
            <div className={open ? "side-drawer drawer-open" : "side-drawer"}>
                <div>
                    <h4 className="user atom">Atom Notebook<i className="fas fa-bars" onClick={mobile ? toggleDrawer : null}></i></h4>
                    <h4 className={active === 0 ? "active" : null} onClick={e => setActive(0)}>
                        <i className="far fa-sun"></i>My Day
                    </h4>
                    <h4 className={active === 1 ? "active" : null} onClick={e => setActive(1)}>
                        <i className="far fa-bell"></i>Important
                    </h4>
                    <h4 className={active === 2 ? "active" : null} onClick={e => setActive(2)}>
                        <i className="far fa-calendar-alt"></i>Calendar
                    </h4>
                    <h4 className={active === 3 ? "active" : null} onClick={e => setActive(3)}>
                        <i className="far fa-edit"></i>Notes
                    </h4>
                </div>

                <div className="groups">
                    <h4 className="title">Groups 
                        <button className="icon" onClick={() => setRemoving(true)} disabled={groups.length < 1 ? true: false}>
                            <i className="fas fa-minus"></i>
                        </button>
                        <button className="icon" onClick={() => setAdding(true)} disabled={groups.length > 5 ? true : false}>
                            <i className="fas fa-plus"></i>
                        </button>
                    </h4>
                    {adding ? beginAdd() : null}
                    {removing ? <button className="stop-delete" onClick={e => setRemoving(false)}>Cancel</button> : null}
                    {groups.map((group) => (
                        <div key={group.id}>
                            <h4>
                                {group.name} 
                                {removing ? <button className="remove" onClick={e => deleteGroup(group)}>Delete</button> : null}
                            </h4>
                        </div>
                    ))}
                </div>

                <h5 className="logout" onClick={handleLogout}>Logout&nbsp;&nbsp;
                    <i className="fas fa-sign-out-alt"></i>
                </h5>
            </div>
            </>
        );
    } else {
        return <></>;
    }
}

export default Header;