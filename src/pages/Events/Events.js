import React from 'react';
import Header from '../../components/Header/Header';
import './Events.scss';

const Events = () => {
    return (
        <>
        <Header  active={2} />
        <div className="events">
            <h3>Events</h3>
        </div>
        </>
    );
}

export default Events;