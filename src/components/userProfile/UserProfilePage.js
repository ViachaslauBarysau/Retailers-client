import React, {useContext, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import {AuthContext} from "../../context/authContext";
import { makeStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(60),
            height: theme.spacing(16),
        },
    },
}));

export default () => {
    const {user, logout} = useContext(AuthContext);
    const classes = useStyles();

    const [snackBar, setSnackBar] = useState({
        display: false,
        message: "",
        severity: "success"
    });

    const handleOpenSnackBar = (message, severity) => {
        setSnackBar({
            display: true,
            message,
            severity
        });
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({
            display: false,
            message: ""
        });
    };

    return (
        <div>
            {user &&
            <div className={classes.root}>
                <form>
                    <Paper elevation={0}>
                        <TextField margin="dense"
                                   size="small"
                                   name="name"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={user.firstName}
                                   label="Name"
                                   disabled/>

                        <br/>
                        <TextField margin="dense"
                                   size="small"
                                   name="surname"
                                   value={user.lastName}
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Surname"
                                   disabled/>
                        <br/>
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

                        {/*<InputLabel id="role-label">Role:</InputLabel>*/}
                        {/*<Select*/}
                        {/*    variant="outlined"*/}
                        {/*    labelId="role-label"*/}
                        {/*    id="role"*/}
                        {/*    value={role}*/}
                        {/*    onChange={handleRoleChange}*/}
                        {/*>*/}
                        {/*    <MenuItem value={"DISPATCHER"}>Dispatcher</MenuItem>*/}
                        {/*    <MenuItem value={"WAREHOUSE_MANAGER"}>Warehouse manager</MenuItem>*/}
                        {/*    <MenuItem value={"SHOP_MANAGER"}>Shop manager</MenuItem>*/}
                        {/*    <MenuItem value={"DIRECTOR"}>Director</MenuItem>*/}
                        {/*</Select>*/}

                        {/*{(role === "DISPATCHER" || role === "WAREHOUSE_MANAGER") &&*/}
                        {/*<Autocomplete*/}
                        {/*    id="location"*/}
                        {/*    size="small"*/}
                        {/*    name="location"*/}
                        {/*    clearOnEscape*/}
                        {/*    value={userLocation}*/}
                        {/*    disabled={role === "DIRECTOR"}*/}
                        {/*    onChange={handleLocationChange}*/}
                        {/*    options={locations.filter(location => location.locationType === "WAREHOUSE").map((option) =>*/}
                        {/*        option.identifier.toString())}*/}
                        {/*    renderInput={(params) => (*/}
                        {/*        <TextField {...params}*/}
                        {/*                   fullWidth={true}*/}
                        {/*                   label="Location"*/}
                        {/*                   margin="dense"*/}
                        {/*                   variant="outlined"*/}
                        {/*                   required/>*/}
                        {/*    )}*/}
                        {/*/>}*/}

                        {/*{(role === "SHOP_MANAGER") &&*/}
                        {/*<Autocomplete*/}
                        {/*    id="location"*/}
                        {/*    size="small"*/}
                        {/*    name="location"*/}
                        {/*    clearOnEscape*/}
                        {/*    value={userLocation}*/}
                        {/*    disabled={role === "DIRECTOR"}*/}
                        {/*    onChange={handleLocationChange}*/}
                        {/*    options={locations.filter(location => location.locationType === "SHOP").map((option) =>*/}
                        {/*        option.identifier.toString())}*/}
                        {/*    renderInput={(params) => (*/}
                        {/*        <TextField {...params}*/}
                        {/*                   fullWidth={true}*/}
                        {/*                   label="Location"*/}
                        {/*                   margin="dense"*/}
                        {/*                   variant="outlined"*/}
                        {/*                   required/>*/}
                        {/*    )}*/}
                        {/*/>}*/}
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

                    </Paper>
                    <Button my={1} type="submit"
                            variant="contained">Edit profile</Button>
                </form>

            </div>
            }
        </div>
    );
}


