import { AuthContext } from '../context/authContext';
import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../App.styles';
import UserProfile from "./UserProfile";

export default () => {
    const classes = useStyles();
    const { user } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(user);

    if (user) {
        switch (user.userRole[0]) {
            case "SYSTEM_ADMIN":
                return (
                    <AppBar position={'static'}>
                        <Toolbar>
                            <Link to={'/customers'} className={classes.menuLink}>Customers</Link>
                            <Link to={'/supplierapplications'} className={classes.menuLink}>Sup. applications</Link>
                            <Link to={'/innerapplications'} className={classes.menuLink}>Inner applications</Link>
                            <Link to={'/products'} className={classes.menuLink}>Products</Link>
                            <Link to={'/bills'} className={classes.menuLink}>Bills</Link>
                            <Link to={'/locations'} className={classes.menuLink}>Locations</Link>
                            <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
                            <Link to={'/users'} className={classes.menuLink}>Users</Link>
                            <Link to={'/location_products'} className={classes.menuLink}>Location products</Link>
                            <Link to={'/category'} className={classes.lastMenuLink}>Category</Link>
                            <UserProfile />
                        </Toolbar>
                    </AppBar>
                );
                break;
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
                break;
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
                break;
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
                break;
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
                break;
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
                break;
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
                    <UserProfile />
                </Toolbar>
            </AppBar>
        );
    }
}

