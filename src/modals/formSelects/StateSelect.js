import React, {useEffect, useState} from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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

    const {states} = statesData;

    return (
        <Select
            labelId="demo-simple-select-label"
            id="state"
        >
            {states.map(state => <States state={state} key={state.id}/>)}
        </Select>

    )
}

function States({state}) {
    return (
        <MenuItem value={state.id}>{state.name}</MenuItem>
    )
}