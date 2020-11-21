import { AuthContext } from '../context/authContext';
import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useStyles } from '../App.styles';
import UserProfile from "./UserProfile";

export default () => {
    const classes = useStyles();
    const { user } = useContext(AuthContext);
  
    if (user != null) {
        switch (user.userRole) {
            case "SYSTEM_ADMIN":
                return (
                    <AppBar position={'static'}>
                        <Toolbar>
                            <Link to={'/customers'} className={classes.menuLink}>Customers</Link>
                            <Link to={'/users'} className={classes.lastMenuLink}>Users</Link>
                            <UserProfile />
                        </Toolbar>
                    </AppBar>
                );
            case "ADMIN":
                return (
                    <AppBar position={'static'}>
                        <Toolbar>
                            <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
                            <Link to={'/products'} className={classes.menuLink}>Products</Link>
                            <Link to={'/bills'} className={classes.menuLink}>Bills</Link>
                            <Link to={'/users'} className={classes.lastMenuLink}>Users</Link>
                            <UserProfile />
                        </Toolbar>
                    </AppBar>
                );
            case "DISPATCHER":
                return (
                    <AppBar position={'static'}>
                        <Toolbar>
                            <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
                            <Link to={'/products'} className={classes.lastMenuLink}>Products</Link>
                            <UserProfile />
                        </Toolbar>
                    </AppBar>
                );
            case "WAREHOUSE_MANAGER":
                return (
                    <AppBar position={'static'}>
                        <Toolbar>
                            <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
                            <Link to={'/products'} className={classes.menuLink}>Products</Link>
                            <Link to={'/bills'} className={classes.lastMenuLink}>Bills</Link>
                            <UserProfile />
                        </Toolbar>
                    </AppBar>
                );
            case "SHOP_MANAGER":
                return (
                    <AppBar position={'static'}>
                        <Toolbar>
                            <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
                            <Link to={'/products'} className={classes.menuLink}>Products</Link>
                            <Link to={'/bills'} className={classes.menuLink}>Bills</Link>
                            <Link to={'/users'} className={classes.lastMenuLink}>Users</Link>
                            <UserProfile />
                        </Toolbar>
                    </AppBar>
                );
            case ("DIRECTOR"):
                return (
                    <AppBar position={'static'}>
                        <Toolbar>
                            <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
                            <Link to={'/users'} className={classes.lastMenuLink}>Users</Link>
                            <UserProfile />
                        </Toolbar>
                    </AppBar>
                );
            default:
                return (
                    <AppBar position={'static'}>
                        <Toolbar>
                            <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
                            <Link to={'/customers'} className={classes.menuLink}>Customers</Link>
                            <Link to={'/supplierapplications'} className={classes.menuLink}>Applications</Link>
                            <Link to={'/products'} className={classes.menuLink}>Products</Link>
                            <Link to={'/bills'} className={classes.menuLink}>Bills</Link>
                            <Link to={'/locations'} className={classes.menuLink}>Locations</Link>
                            <Link to={'/users'} className={classes.lastMenuLink}>Users</Link>
                            <UserProfile />
                        </Toolbar>
                    </AppBar>
                );
        }
    } else {
        return (
            <AppBar position={'static'}>
                <Toolbar>
                    <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
                    <Link to={'/customers'} className={classes.menuLink}>Customers</Link>
                    <Link to={'/supplierapplications'} className={classes.menuLink}>Applications</Link>
                    <Link to={'/products'} className={classes.menuLink}>Products</Link>
                    <Link to={'/bills'} className={classes.menuLink}>Bills</Link>
                    <Link to={'/locations'} className={classes.menuLink}>Locations</Link>
                    <Link to={'/users'} className={classes.lastMenuLink}>Users</Link>
                    <UserProfile />
                </Toolbar>
            </AppBar>
        );
    }
}

