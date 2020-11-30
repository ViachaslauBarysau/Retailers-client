import React, {useEffect, useState} from 'react';
import MenuItem from "@material-ui/core/MenuItem";
import Select from '@material-ui/core/Select';

export default (props) => {
    const [states, setStates] = useState(
        null
    );
    const [state, setState] = useState(1)

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

    function updateSelect(e) {
        setState(e.target.value);
        props.onChangeState(state)
    }

    return (
        <div>
            {states &&
            <Select id="state" variant="outlined" required
                    value={1}
                    onChange={updateSelect}>
                {states.map(state => <MenuItem key={state.id} value={state.id}>{state.name}</MenuItem>)}
            </Select>
            }
        </div>

    )
}