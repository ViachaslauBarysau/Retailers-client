import React, {useContext, useEffect, useState} from 'react';
import MenuItem from "@material-ui/core/MenuItem";
import Select from '@material-ui/core/Select';
import {AuthContext} from "../context/authContext";

export default (props) => {
    const { logout } = useContext(AuthContext);
    const [states, setStates] = useState(
        null
    );
    const [state, setState] = useState(props.value)

    useEffect(() => {
        fetch('/api/states?size=50', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .then(states => {
                setStates(
                    states.content
                );
            })
    }, []);

    function updateSelect(e) {
        setState(e.target.value);
        props.onChangeState(e)
    }

    return (
        <div>
            {states &&
            <Select id="state" variant="outlined" required
                    value={state}
                    onChange={updateSelect}
            >
                {states.map(state => <MenuItem key={state.id} value={state.id}>{state.name}</MenuItem>)}
            </Select>
            }
        </div>
    )
}