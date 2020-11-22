import React, {useContext, useState} from 'react';
import { Switch, Route } from "react-router-dom";

import withAuth from "../hoc/withAuth";

import Index from '../pages/Index';
import Login from '../pages/Login';
import Users from './user/Users';
import Customers from './customer/Customers';
import WriteOffActs from './act/WriteOffActs';
import Products from './product/Products';
import Bills from './bill/Bills';
import Locations from './location/Locations';
import SupplierApplications from './application/SupplierApplications';
import Test from "../pages/Test";
import {AuthContext} from "../context/authContext";
import {useStyles} from "../App.styles";



export default () => {
    const { user } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(user);
    if (user) {
        switch (user.userRole[0]) {
            case "SYSTEM_ADMIN":
                return (
                    <React.Fragment>
                        <div>
                            <Switch>
                                <Route path={'/'} component={withAuth(Customers)} exact={true} />
                                <Route path={'/login'} component={Login} />
                                <Route path={'/users'} component={withAuth(Users)} />
                                <Route path={'/customers'} component={withAuth(Customers)} />
                                <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)} />
                                <Route path={'/products'} component={withAuth(Products)} />
                                <Route path={'/bills'} component={withAuth(Bills)} />
                                <Route path={'/locations'} component={withAuth(Locations)} />
                                <Route path={'/supplierapplications'} component={withAuth(SupplierApplications)} />
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
                                <Route path={'/supplierapplications'} component={withAuth(SupplierApplications)} />
                                <Route path={'/test'} component={Test} />
                                <Route component={Login} />
                            </Switch>
                        </div>
                    </React.Fragment>
                );
        }
    } else {
        return (
            <React.Fragment>
                        <div>
                            <Switch>
                                <Route component={Login} />
                            </Switch>
                        </div>
                    </React.Fragment>
        );
    }
}
