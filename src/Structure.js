import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import SideBar from "./components/SideBar";
import UserProfile from "./components/UserProfile";
import Routes from "./components/Routes";
import {useStyles} from './App.styles';

export default function ClippedDrawer() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Customer App
                    </Typography>
                    <div style={{position: "fixed", right: 20}}>
                        <UserProfile/>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar/>
                <div className={classes.drawerContainer}>
                    <List>
                        <SideBar/>
                    </List>
                </div>
            </Drawer>
            <main className={classes.content}>
                <Toolbar/>
                <Routes/>
            </main>
        </div>
    );
}
