import React from 'react';
import { Switch, Route } from "react-router-dom";

import withAuth from "../hoc/withAuth";

import Index from '../pages/Index';
import Login from '../pages/Login';
import Users from '../pages/Users';
import Customers from '../pages/Customers';
import WriteOffActs from '../pages/WriteOffActs';
import Products from '../pages/Products';
import Bills from '../pages/Bills';
import Locations from '../pages/Locations';



export default () => {
    let role = localStorage.getItem("user").role;
    switch (role) {
        case "SYSTEM_ADMIN":
            return (
                <React.Fragment>
                    <div>
                        <Switch>
                            <Route path={'/login'} component={Login} />
                            <Route path={'/'} component={withAuth(Customers)} exact={true} />
                            <Route path={'/users'} component={withAuth(Users)} />
                            <Route path={'/customers'} component={withAuth(Customers)} />
                            <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)} />
                            <Route path={'/products'} component={withAuth(Products)} />
                            <Route path={'/bills'} component={withAuth(Bills)} />
                            <Route path={'/locations'} component={withAuth(Locations)} />
                            <Route component={Index} />
                        </Switch>
                    </div>
                </React.Fragment>
            );
        case "ADMIN":
            return (
                <React.Fragment>
                    <div><Switch>
                        <Route path={'/'} component={Index} exact={true} />
                        <Route path={'/login'} component={Login} />
                        <Route path={'/users'} component={withAuth(Users)} />
                        <Route path={'/customers'} component={withAuth(Customers)} />
                        <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)} />
                        <Route path={'/products'} component={withAuth(Products)} />
                        <Route path={'/bills'} component={withAuth(Bills)} />
                        <Route component={Index} />
                    </Switch>
                    </div>
                </React.Fragment>
            );
        case "DISPATCHER":
            return (
                <React.Fragment>
                    <div>
                        <Switch>
                            <Route path={'/'} component={Index} exact={true} />
                            <Route path={'/login'} component={Login} />
                            <Route path={'/users'} component={withAuth(Users)} />
                            <Route path={'/customers'} component={withAuth(Customers)} />
                            <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)} />
                            <Route path={'/products'} component={withAuth(Products)} />
                            <Route path={'/bills'} component={withAuth(Bills)} />
                            <Route component={Index} />
                        </Switch>
                    </div>
                </React.Fragment>
            );
        case "WAREHOUSE_MANAGER":
            return (
                <React.Fragment>
                    <div>
                        <Switch>
                            <Route path={'/'} component={Index} exact={true} />
                            <Route path={'/login'} component={Login} />
                            <Route path={'/users'} component={withAuth(Users)} />
                            <Route path={'/customers'} component={withAuth(Customers)} />
                            <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)} />
                            <Route path={'/products'} component={withAuth(Products)} />
                            <Route path={'/bills'} component={withAuth(Bills)} />
                            <Route component={Index} />
                        </Switch>
                    </div>
                </React.Fragment>
            );
        case "SHOP_MANAGER":
            return (
                <React.Fragment>
                    <div>
                        <Switch>
                            <Route path={'/'} component={Index} exact={true} />
                            <Route path={'/login'} component={Login} />
                            <Route path={'/users'} component={withAuth(Users)} />
                            <Route path={'/customers'} component={withAuth(Customers)} />
                            <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)} />
                            <Route path={'/products'} component={withAuth(Products)} />
                            <Route path={'/bills'} component={withAuth(Bills)} />
                            <Route component={Index} />
                        </Switch>
                    </div>
                </React.Fragment>
            );
        case ("DIRECTOR"):
            return (
                <React.Fragment>
                    <div>
                        <Switch>
                            <Route path={'/'} component={Index} exact={true} />
                            <Route path={'/login'} component={Login} />
                            <Route path={'/users'} component={withAuth(Users)} />
                            <Route path={'/customers'} component={withAuth(Customers)} />
                            <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)} />
                            <Route path={'/products'} component={withAuth(Products)} />
                            <Route path={'/bills'} component={withAuth(Bills)} />
                            <Route component={Index} />
                        </Switch>
                    </div>
                </React.Fragment>
            );
        default:
            return (
                <React.Fragment>
                    <div>
                        <Switch>
                            <Route path={'/'} component={Index} exact={true} />
                            <Route path={'/login'} component={Login} />
                            <Route path={'/users'} component={withAuth(Users)} />
                            <Route path={'/customers'} component={withAuth(Customers)} />
                            <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)} />
                            <Route path={'/products'} component={withAuth(Products)} />
                            <Route path={'/locations'} component={withAuth(Locations)} />
                            <Route path={'/bills'} component={withAuth(Bills)} />
                            <Route component={Login} />
                        </Switch>
                    </div>
                </React.Fragment>
            );
    }
}
