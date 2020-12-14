import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../Button';
import StateSelect from '../../StateSelect';
import Select from "@material-ui/core/Select/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {AuthContext} from "../../../context/authContext";
import {validateUserCreation} from "../../../validation/UserValidator";

const UserCreateModal = (props) => {
    const {user, logout} = useContext(AuthContext);
    const [stateId, setStateId] = useState(1);
    const [role, setRole] = useState("DIRECTOR");
    const [locations, setLocations] = useState(null);
    const [validationResults, setValidationResults] = useState(["errors"]);

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
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .then(locations => {
                setLocations(locations.content)
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            });
    }, []);

    function addUser(e) {
        e.preventDefault();
        let location = role === "DIRECTOR" ? null : locations.filter(location => location.identifier === e.target.location.value)[0];
        let validResults = validateUserCreation(e);
        if (validResults.length === 0) {
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
            })
                .then(res => {
                    switch (res.status) {
                        case 201:
                            props.handleOpenSnackBar("User created!", "success");
                            props.onCloseModal();
                            props.needrefresh();
                            break;
                        case 401:
                            logout();
                            break;
                        case 451:
                            props.handleOpenSnackBar("Login and email should be unique!", "warning");
                            break;
                    }
                })
                .catch(e => {
                    props.handleOpenSnackBar("Error happens!", "error");
                });
        }
        setValidationResults(validResults);
    }

    return (
        <div>
            {locations &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={addUser}>
                        <TextField margin="dense"
                                   size="small"
                                   name="name"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="First name"
                                   error={validationResults.includes("name")}
                                   helperText={validationResults.includes("name") ?
                                       "First name minimum length 2 symbols." : ""}
                        />
                        <TextField margin="dense"
                                   size="small"
                                   id="surname"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Last name"
                                   error={validationResults.includes("surname")}
                                   helperText={validationResults.includes("surname") ?
                                       "Last name minimum length 2 symbols." : ""}
                        />
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
                            error={validationResults.includes("birthday")}
                            helperText={validationResults.includes("birthday") ?
                                "User's age must be between 18 and 100 years." : ""}
                        />
                        <InputLabel id="state-label">State:</InputLabel>
                        <StateSelect onChangeState={updateStateSelectValue} value={stateId}/>

                        <TextField margin="dense"
                                   size="small"
                                   name="city"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="City"
                                   error={validationResults.includes("city")}
                                   helperText={validationResults.includes("city") ?
                                       "Min length 3 symbols." : ""}
                        />

                        <TextField margin="dense"
                                   size="small"
                                   name="address1"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Address line 1"
                                   error={validationResults.includes("firstAddressLine")}
                                   helperText={validationResults.includes("firstAddressLine") ?
                                       "Min length 5 symbols." : ""}
                        />

                        <TextField margin="dense"
                                   size="small"
                                   name="address2"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Address line 2"/>

                        <InputLabel id="role-label">Role:</InputLabel>
                        <Select MenuProps={{autoFocus: true}}
                                variant="outlined"
                                labelId="role-label"
                                name="role"
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
                                <TextField {...params}
                                           fullWidth={true}
                                           label="Location"
                                           margin="dense"
                                           variant="outlined"
                                           error={validationResults.includes("location")}
                                           helperText={validationResults.includes("location") ?
                                               "Choose location." : ""}
                                />
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
                                <TextField {...params}
                                           fullWidth={true}
                                           label="Location"
                                           margin="dense"
                                           variant="outlined"
                                           error={validationResults.includes("location")}
                                           helperText={validationResults.includes("location") ?
                                               "Choose location." : ""}
                                />
                            )}
                        />
                        }

                        <TextField margin="dense"
                                   size="small"
                                   name="login"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Login"
                                   error={validationResults.includes("login")}
                                   helperText={validationResults.includes("login") ?
                                       "Min length of login is 3 symbols." : ""}
                        />

                        <TextField margin="dense"
                                   size="small"
                                   name="email"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Email"
                                   error={validationResults.includes("email")}
                                   helperText={validationResults.includes("email") ? "Incorrect email." : ""}
                        />

                        <Button my={1} type="submit"
                                variant="contained">Add user</Button>
                        <Button m={1} id="closeButton"
                                onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>

    )
}

export default UserCreateModal;


