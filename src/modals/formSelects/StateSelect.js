import React, {useEffect, useState} from 'react';
import MenuItem from "@material-ui/core/MenuItem";
import Select from '@material-ui/core/Select';

export default () => {
    const [states, setStates] = useState(
        []
    );

    useEffect(() => {
        fetch('http://localhost:8080/api/states?size=50', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(states => {
                setStates(
                    states
                );
            })
    }, []);

    return (
            <Select id="state" variant="outlined">
                {states.map(state => <MenuItem key={state.id} value={state.id}>{state.name}</MenuItem>)}
            </Select>
    )
}