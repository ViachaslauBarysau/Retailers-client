import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

export default (props) => {
    const { user, setUser } = useContext(AuthContext);
    const prevPageLocation = props?.history?.location?.state?.from || '/';


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

    const loginForm = (
        <div style={{ padding: '40px' }}>
            <Container maxWidth={'sm'}>
                <Typography variant="h4" style={{margin: 20, textAlign: 'center'}}>Login</Typography>
                <Box style={{marginBottom: 40}}>
                    <FormControl
                        fullWidth={true}>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input type={"text"}
                               value={fields['username']}
                               onChange={handleInput('username')}/>
                    </FormControl>
                    <FormControl
                        fullWidth={true}>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input type={"password"}
                               value={fields['password']}
                               onChange={handleInput('password')}/>
                    </FormControl>
                </Box>
                <Button
                    fullWidth={true}
                    color="primary"
                    variant="contained"
                    onClick={(e) => {
                        e.preventDefault();
                        const { username, password } = fields;
                        if (username === 'user' && password === 'user') {
                            setUser({
                                username: 'user'
                            });
                        }
                    }}>
                    Login
                </Button>
            </Container>
        </div>
    )

    return user ? <Redirect to={prevPageLocation}/> : loginForm;
}