import React, {useContext, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import {AuthContext} from "../../context/authContext";
import {makeStyles} from '@material-ui/core/styles';
import StateSelect from "../StateSelect";
import InputLabel from "@material-ui/core/InputLabel";
import {validateUserEditingByUser} from "../../validation/UserValidator";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

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
    const {user, logout, setUser} = useContext(AuthContext);
    const [validationResults, setValidationResults] = useState([]);
    const classes = useStyles();
    const [updatedUser, setUpdatedUser] = useState(user)

    const [snackBar, setSnackBar] = useState({
        display: false,
        message: "",
        severity: ""
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

    const updateStateSelectValue = (e) => {
        setUpdatedUser({
                ...updatedUser,
                address: {
                    ...updatedUser.address,
                    state: {
                        id: e.target.value,
                    }
                }
            }
        );
    }

    const handleCityChange = (e) => {
        setUpdatedUser({
                ...updatedUser,
                address: {
                    ...updatedUser.address,
                    city: e.target.value,
                }
            }
        );
    }

    const handleFirstAddressLineChange = (e) => {
        setUpdatedUser({
                ...updatedUser,
                address: {
                    ...updatedUser.address,
                    firstAddressLine: e.target.value,
                }
            }
        );
    }

    const handleSecondAddressLineChange = (e) => {
        setUpdatedUser({
                ...updatedUser,
                address: {
                    ...updatedUser.address,
                    secondAddressLine: e.target.value,
                }
            }
        );
    }

    const handleLoginChange = (e) => {
        setUpdatedUser({
                ...updatedUser,
                login: e.target.value,
            }
        );
    }

    const handleEmailChange = (e) => {
        setUpdatedUser({
                ...updatedUser,
                email: e.target.value,
            }
        );
    }

    const handleBirthdayChange = (e) => {
        setUpdatedUser({
                ...updatedUser,
                birthday: e.target.value,
            }
        );
    }

    const handleNameChange = (e) => {
        setUpdatedUser({
                ...updatedUser,
                firstName: e.target.value,
            }
        );
    }

    const handleSurnameChange = (e) => {
        setUpdatedUser({
                ...updatedUser,
                lastName: e.target.value,
            }
        );
    }

    function editUser() {
        let validResults = validateUserEditingByUser(updatedUser);
        if (validResults.length === 0) {
            fetch('/api/users', {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(updatedUser),
                method: "PUT"
            })
                .then(res => {
                    if (res.ok) {
                        setUser(updatedUser);
                        handleOpenSnackBar("User updated!", "success");
                    } else if (res.status === 401) {
                        logout();
                    } else if (res.status === 451) {
                        handleOpenSnackBar("Login and email must be unique!", "warning");
                    }
                })
                .catch(e => {
                    handleOpenSnackBar("Error happens!", "error");
                });
        }
        setValidationResults(validResults);
    }


    function updatePassword(e) {
        e.preventDefault();
        fetch('/api/users/updatePassword', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                ...updatedUser,
                password: e.target.password.value
            }),
            method: "PUT"
        })
            .then(res => {
                if (res.ok) {
                    handleOpenSnackBar("Password updated!", "success");
                } else if (res.status === 401) {
                    logout();
                }
            })
            .catch(e => {
                handleOpenSnackBar("Error happens!", "error");
            });
    }


    return (
        <div>
            {updatedUser &&
            <div className={classes.root}>
                <form onSubmit={updatePassword}>
                    <div>
                        <TextField margin="dense"
                                   size="small"
                                   name="name"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={updatedUser.firstName}
                                   label="Name"
                                   onChange={handleNameChange}
                                   error={validationResults.includes("name")}
                                   helperText={validationResults.includes("name") ?
                                       "First name minimum length 2 symbols." : ""}
                        />
                        <TextField margin="dense"
                                   size="small"
                                   name="surname"
                                   value={updatedUser.lastName}
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Surname"
                                   onChange={handleSurnameChange}
                                   error={validationResults.includes("surname")}
                                   helperText={validationResults.includes("surname") ?
                                       "Last name minimum length 2 symbols." : ""}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            name="date_of_birth"
                            label="Date of birth"
                            type="date"
                            defaultValue={updatedUser.birthday}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleBirthdayChange}
                            error={validationResults.includes("birthday")}
                            helperText={validationResults.includes("birthday") ?
                                "User's age must be between 18 and 100 years." : "  "}
                        />
                        <InputLabel id="state-label">State:</InputLabel>
                        <StateSelect onChangeState={updateStateSelectValue} value={updatedUser.address.state.id}/>
                        <TextField margin="dense"
                                   size="small"
                                   name="city"
                                   fullWidth={true}
                                   value={updatedUser.address.city}
                                   variant="outlined"
                                   label="City"
                                   onChange={handleCityChange}
                                   error={validationResults.includes("city")}
                                   helperText={validationResults.includes("city") ?
                                       "Min length 3 symbols." : ""}
                        />
                        <TextField margin="dense"
                                   size="small"
                                   name="address1"
                                   value={updatedUser.address.firstAddressLine}
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Address line 1"
                                   onChange={handleFirstAddressLineChange}
                                   error={validationResults.includes("firstAddressLine")}
                                   helperText={validationResults.includes("firstAddressLine") ?
                                       "Min length 5 symbols." : ""}
                        />

                        <TextField margin="dense"
                                   size="small"
                                   name="address2"
                                   value={updatedUser.address.secondAddressLine}
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Address line 2"
                                   onChange={handleSecondAddressLineChange}
                        />

                        <TextField margin="dense"
                                   size="small"
                                   name="role"
                                   value={String(updatedUser.userRole).toLowerCase().replace("_", " ")}
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Role"
                                   disabled
                        />

                        {updatedUser.userRole !== "DIRECTOR" &&
                        updatedUser.userRole !== "ADMIN" &&
                        updatedUser.userRole !== "SYSTEM_ADMIN" &&
                        <TextField margin="dense"
                                   size="small"
                                   name="location"
                                   value={updatedUser.location.identifier}
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Location"
                                   disabled
                        />
                        }
                        <TextField margin="dense"
                                   size="small"
                                   name="login"
                                   fullWidth={true}
                                   value={updatedUser.login}
                                   variant="outlined"
                                   label="Login"
                                   onChange={handleLoginChange}
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   name="email"
                                   fullWidth={true}
                                   value={updatedUser.email}
                                   variant="outlined"
                                   label="Email"
                                   onChange={handleEmailChange}
                                   disabled/>

                    </div>
                    <Button my={1} onClick={editUser}
                            variant="contained">Edit profile</Button>
                    <br/>
                    Change password:
                    <TextField margin="dense"
                               size="small"
                               name="password"
                               fullWidth={true}
                               variant="outlined"
                               type="password"
                               placeholder="Enter new password"
                    />
                    <TextField margin="dense"
                               size="small"
                               name="confirmedPassword"
                               fullWidth={true}
                               variant="outlined"
                               type="password"
                               placeholder="Confirm new password"
                    />
                    <Button my={1} type="submit"
                            variant="contained">Update password</Button>
                </form>

            </div>
            }
            <Snackbar open={snackBar.display} autoHideDuration={6000} onClose={handleCloseSnackBar}>
                <Alert onClose={handleCloseSnackBar} severity={snackBar.severity}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}


