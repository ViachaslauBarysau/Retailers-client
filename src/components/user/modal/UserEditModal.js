import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../Button';
import Select from "@material-ui/core/Select/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {AuthContext} from "../../../context/authContext";
import {validateUserEditingByAdmin} from "../../../validation/UserValidator";

const UserEditModal = (props) => {
    const {logout} = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState("");
    const [locations, setLocations] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [validationResults, setValidationResults] = useState(["errors"]);

    function handleRoleChange(e) {
        setRole(e.target.value)
        setUserLocation(null);
    }

    const handleLocationChange = (e) => {
        setUserLocation(e.target.innerText);
    }

    useEffect(() => {
        fetch('/api/locations?size=1000', {
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
        fetch('/api/users/' + props.userId, {
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
            .then(user => {
                setUser(user);
                setRole(user.userRole[0]);
                if (user.userRole[0] != "DIRECTOR") {
                    setUserLocation(user.location.identifier);
                }
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
                props.onCloseModal();
            });
    }, []);


    function editUser(e) {
        e.preventDefault();
        let location = role === "DIRECTOR" ? null : locations.filter(location => location.identifier === e.target.location.value)[0];
        setValidationResults(validateUserEditingByAdmin(e))
        if (validationResults.length === 0) {
            fetch('/api/users', {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    ...user,
                    location,
                    userRole: [role]
                }),
                method: "PUT"
            })
                .then(res => {
                    if (res.ok) {
                        props.handleOpenSnackBar("User updated!", "success");
                        props.onCloseModal();
                        props.needrefresh();
                    } else if (res.status === 401) {
                        logout();
                    }
                })
                .catch(e => {
                    props.handleOpenSnackBar("Error happens!", "error");
                });
        }
    }

    return (
        <div>
            {user && locations && role &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={editUser}>
                        <TextField margin="dense"
                                   size="small"
                                   name="name"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={user.firstName}
                                   label="Name"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   name="surname"
                                   value={user.lastName}
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Surname"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   name="date_of_birth"
                                   value={user.birthday}
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Date of birth"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   name="state"
                                   value={user.address.state.name}
                                   fullWidth={true}
                                   variant="outlined"
                                   label="State"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   name="city"
                                   fullWidth={true}
                                   value={user.address.city}
                                   variant="outlined"
                                   label="City"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   name="address1"
                                   value={user.address.firstAddressLine}
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Address line 1"
                                   disabled/>

                        <TextField margin="dense"
                                   size="small"
                                   name="address2"
                                   value={user.address.secondAddressLine}
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Address line 2"
                                   disabled/>

                        <InputLabel id="role-label">Role:</InputLabel>
                        <Select
                            variant="outlined"
                            labelId="role-label"
                            id="role"
                            name="role"
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
                            value={userLocation}
                            disabled={role === "DIRECTOR"}
                            onChange={handleLocationChange}
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
                        />}

                        {(role === "SHOP_MANAGER") &&
                        <Autocomplete
                            id="location"
                            size="small"
                            name="location"
                            clearOnEscape
                            value={userLocation}
                            disabled={role === "DIRECTOR"}
                            onChange={handleLocationChange}
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
                        />}
                        <TextField margin="dense"
                                   size="small"
                                   name="login"
                                   fullWidth={true}
                                   value={user.login}
                                   variant="outlined"
                                   label="Login"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   name="email"
                                   fullWidth={true}
                                   value={user.email}
                                   variant="outlined"
                                   label="Email"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   name="status"
                                   fullWidth={true}
                                   value={user.userStatus}
                                   variant="outlined"
                                   label="Status"
                                   disabled/>
                        <Button my={1} type="submit"
                                variant="contained">Edit user</Button>
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

export default UserEditModal;


