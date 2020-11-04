import React from 'react';
import { Link } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useStyles } from '../App.styles';
import UserProfile from "./UserProfile";

export default () => {
    const classes = useStyles();
    return(<AppBar position={'static'}>
    <Toolbar>
        <Link to={'/customers'} className={classes.menuLink}>Customers</Link>
        <Link to={'/users'} className={classes.lastMenuLink}>Users</Link>
        <UserProfile/>
    </Toolbar>
    </AppBar>)
}

