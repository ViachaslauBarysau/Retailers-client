import React, {useContext, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {AuthContext} from "../context/authContext";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {validateLogin} from "../validation/LoginValidator";
import Route from "react-router-dom/es/Route";

export default (props) => {
    const {user, setUser} = useContext(AuthContext);

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

    const [fields, setField] = useState({
        username: '',
        password: ''
    });
    const [loginState, changeLoginState] = useState({
        user: null,
        loginFailed: false
    })

    const handleInput = (fieldName) =>
        (e) => {
            const value = e.target.value;
            setField(preState => ({
                ...preState,
                [fieldName]: value
            }))
        };


    const handleLogin = (e) => {
        e.preventDefault();
        let validResults = validateLogin(fields);
        if (validResults.length === 0) {
            fetch("/api/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email: fields.username,
                    password: fields.password
                })
            })
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    } else if (res.status === 403) {
                        handleOpenSnackBar("Wrong email or password!", "error");
                        changeLoginState({
                                user: null,
                                loginFailed: true
                            }
                        )
                        return Promise.reject(res.json());
                    }
                })
                .then(data => {
                    let prefix = "Bearer_";
                    localStorage.setItem("token", prefix + data.token);
                    setUser(data.user);
                })
        } else {
            changeLoginState({
                user: null,
                loginFailed: true
            });
            handleOpenSnackBar("Incorrect data!", "error");
        }
    }

    const loginForm = (
        <div style={{padding: '40px'}}>
            <Container maxWidth={'sm'}>
                <Typography variant="h4" style={{margin: 20, textAlign: 'center'}}>Login</Typography>
                <Box style={{marginBottom: 40}}>
                    <FormControl
                        fullWidth={true}>
                        <InputLabel htmlFor="username">Email</InputLabel>
                        <Input name={"username"}
                               type={"text"}
                               error={loginState.loginFailed}
                               value={fields['username']}
                               onChange={handleInput('username')}/>
                    </FormControl>
                    <FormControl
                        fullWidth={true}>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input name={"password"}
                               type={"password"}
                               error={loginState.loginFailed}
                               value={fields['password']}
                               onChange={handleInput('password')}/>
                    </FormControl>
                </Box>
                <Button
                    fullWidth={true}
                    color="primary"
                    variant="contained"
                    onClick={handleLogin}>
                    Login
                </Button>
            </Container>
            <Snackbar open={snackBar.display} autoHideDuration={6000} onClose={handleCloseSnackBar}>
                <Alert onClose={handleCloseSnackBar} severity={snackBar.severity}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
        </div>
    )

    return user ? <Route path="/" component={() => (<Redirect to="/"/>)}/> : loginForm;
}
