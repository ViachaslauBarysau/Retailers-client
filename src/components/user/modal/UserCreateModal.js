import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import StateSelect from '../../StateSelect';
import Select from "@material-ui/core/Select/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {AuthContext} from "../../../context/authContext";

const UserCreateModal = (props) => {
    const {user} = useContext(AuthContext);
    const [stateId, setStateId] = useState(1);
    const [role, setRole] = useState("DIRECTOR");
    const [locations, setLocations] = useState(null);

    function updateStateSelectValue(e) {
        setStateId(e.target.value)
    }

    function handleRoleChange(e) {
        setRole(e.target.value);
    }

    useEffect(() => {
        fetch('http://localhost:8080/api/locations?size=1000', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(locations => {
                setLocations(locations.content)
            });
    }, []);

    function addUser(e) {
        e.preventDefault();
        let location;
        if (role === "DIRECTOR") {
            location = null;
        } else {
            location = locations.filter(location => location.identifier === e.target.location.value)[0];
        }
        fetch('http://localhost:8080/api/users', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                firstName: e.target.name.value,
                lastName: e.target.surname.value,
                email: e.target.email.value,
                userRole: [role],
                birthday: e.target.date_of_birth.value,
                userStatus: "ACTIVE",
                location: location,
                login: e.target.login.value,
                customer: user.customer,
                address: {
                    state:
                        {
                            id: stateId,
                        },
                    city: e.target.city.value,
                    firstAddressLine: e.target.address1.value,
                    secondAddressLine: e.target.address2.value
                },
            }),
            method: "POST"
        });
        props.onCloseModal();
    }

    return (
        <div>
            {locations &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={addUser}>
                        <TextField margin="dense" size="small" name="name" fullWidth={true}
                                   variant="outlined" label="Name" required/>

                        <br/>
                        <TextField margin="dense" size="small" id="surname" fullWidth={true}
                                   variant="outlined" label="Surname" required/>
                        <br/>
                        <TextField
                            variant="outlined"
                            margin="dense"
                            name="date_of_birth"
                            label="Date of birth"
                            type="date"
                            defaultValue="2000-01-01"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <InputLabel id="state-label">State:</InputLabel>
                        <StateSelect MenuProps={{ autoFocus: true }} onChangeState={updateStateSelectValue}/>

                        <TextField margin="dense" size="small" name="city" fullWidth={true}
                                   variant="outlined" label="City" required/>

                        <TextField margin="dense" size="small" name="address1" fullWidth={true}
                                   variant="outlined" label="Address line 1" required/>

                        <TextField margin="dense" size="small" name="address2" fullWidth={true}
                                   variant="outlined" label="Address line 2"/>

                        <InputLabel id="role-label">Role:</InputLabel>
                        <Select MenuProps={{ autoFocus: true }}
                            variant="outlined"
                            labelId="role-label"
                            id="role"
                            value={role}
                            onChange={handleRoleChange}
                        >
                            <MenuItem value={"DISPATCHER"}>Dispatcher</MenuItem>
                            <MenuItem value={"WAREHOUSE_MANAGER"}>Warehouse manager</MenuItem>
                            <MenuItem value={"SHOP_MANAGER"}>Shop manager</MenuItem>
                            <MenuItem value={"DIRECTOR"}>Director</MenuItem>
                        </Select>

                        {(role === "DISPATCHER" || role === "WAREHOUSE_MANAGER") &&
                        <Autocomplete
                            id="location"
                            size="small"
                            name="location"
                            clearOnEscape
                            disabled={role === "DIRECTOR"}
                            options={locations.filter(location => location.locationType === "WAREHOUSE").map((option) =>
                                option.identifier.toString())}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth={true} label="Location" margin="dense"
                                           variant="outlined" required/>
                            )}
                        />
                        }

                        {(role === "SHOP_MANAGER") &&
                        <Autocomplete
                            id="location"
                            size="small"
                            name="location"
                            clearOnEscape
                            disabled={role === "DIRECTOR"}
                            options={locations.filter(location => location.locationType === "SHOP").map((option) =>
                                option.identifier.toString())}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth={true} label="Location" margin="dense"
                                           variant="outlined" required/>
                            )}
                        />
                        }

                        <TextField margin="dense" size="small" name="login" fullWidth={true}
                                   variant="outlined" label="Login" required/>

                        <TextField margin="dense" size="small" name="email" fullWidth={true}
                                   variant="outlined" label="Email" required/>

                        <Button type="submit" variant="contained">Add user</Button>
                        <Button id="closeButton" onClick={props.onCloseModal} variant="contained">Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>

    )
}

export default UserCreateModal;


