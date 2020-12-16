import React, {useContext, useState} from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from '../context/authContext';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography";

export default () => {
    const {user} = useContext(AuthContext);

    return user &&
        (
            <div>
                <IconButton
                    component={Link}
                    to={"/profile"}
                    color="inherit">
                    <AccountCircle/>
                    <Typography>{user.email}</Typography>
                </IconButton>
            </div>
        );
}