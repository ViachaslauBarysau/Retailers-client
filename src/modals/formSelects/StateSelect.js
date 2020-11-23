import React, { useState, useEffect } from 'react';

export default () => {
    const [statesData, setData] = useState({
        states: [],
    });

    useEffect(() => {
        fetch('http://localhost:8080/api/states?size=50', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(states => {
                setData((prevState) => ({
                    ...prevState,
                    states
                }));
            })
    }, []);

    const { states } = statesData;

    return (
        <select id="state">
            {states.map(state => <States state={state} key={state.id} />)}
        </select>
    )
}

function States({ state }) {
    return (
    <option value={state.id}>{state.name}</option>
    )
}