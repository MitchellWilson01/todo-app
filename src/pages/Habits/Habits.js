import React from 'react';
import Header from '../../components/Header/Header';
import './Habits.scss';

const Habits = () => {
    return (
        <>
        <Header  active={1} />
        <div className="habits">
            <h3>Habits</h3>
        </div>
        </>
    );
}

export default Habits;