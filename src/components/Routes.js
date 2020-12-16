import React, {useContext} from 'react';
import {Route, Switch} from "react-router-dom";

import withAuth from "../auth/withAuth";

import ForbiddenPage from './ForbiddenPage';
import Login from './Login';
import Users from './user/Users';
import Customers from './customer/Customers';
import WriteOffActs from './act/WriteOffActs';
import Products from './product/Products';
import Bills from './bill/Bills';
import Locations from './location/Locations';

import {AuthContext} from "../context/authContext";
import SupplierApplications from "./application/supplier/SupplierApplications";
import Category from './category/Category';
import InnerApplications from "./application/inner/InnerApplications";
import LocationProducts from "./locationProducts/LocationProducts";
import LocationTax from "./locationTax/LocationTax";
import Suppliers from "./supplier/Suppliers";
import UserProfilePage from "./userProfile/UserProfilePage";

export default () => {
    const {user} = useContext(AuthContext);
    if (user) {
        switch (user.userRole[0]) {
            case "SYSTEM_ADMIN":
                return (
                    <React.Fragment>
                        <div>
                            <Switch>
                                <Route path={'/'} component={withAuth(Customers)} exact={true}/>
                                <Route path={'/login'} component={Login}/>
                                <Route path={'/customers'} component={withAuth(Customers)}/>
                                <Route path={'/profile'} component={withAuth(UserProfilePage)}/>
                                <Route component={ForbiddenPage}/>
                            </Switch>
                        </div>
                    </React.Fragment>
                );
            case "ADMIN":
                return (
                    <React.Fragment>
                        <div><Switch>
                            <Route path={'/'} component={withAuth(Users)} exact={true}/>
                            <Route path={'/login'} component={Login}/>
                            <Route path={'/users'} component={withAuth(Users)}/>
                            <Route path={'/locations'} component={withAuth(Locations)}/>
                            <Route path={'/suppliers'} component={withAuth(Suppliers)}/>
                            <Route path={'/profile'} component={withAuth(UserProfilePage)}/>
                            <Route component={ForbiddenPage}/>
                        </Switch>
                        </div>
                    </React.Fragment>
                );
            case "DISPATCHER":
                return (
                    <React.Fragment>
                        <div>
                            <Switch>
                                <Route path={'/'} component={withAuth(SupplierApplications)} exact={true}/>
                                <Route path={'/login'} component={Login}/>
                                <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)}/>
                                <Route path={'/products'} component={withAuth(Products)}/>
                                <Route path={'/bills'} component={withAuth(Bills)}/>
                                <Route path={'/supplierapplications'} component={withAuth(SupplierApplications)}/>
                                <Route path={'/location_products'} component={withAuth(LocationProducts)}/>
                                <Route path={'/profile'} component={withAuth(UserProfilePage)}/>
                                <Route component={ForbiddenPage}/>
                            </Switch>
                        </div>
                    </React.Fragment>
                );
            case "WAREHOUSE_MANAGER":
                return (
                    <React.Fragment>
                        <div>
                            <Switch>
                                <Route path={'/'} component={withAuth(InnerApplications)} exact={true}/>
                                <Route path={'/login'} component={Login}/>
                                <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)}/>
                                <Route path={'/innerapplications'} component={withAuth(InnerApplications)}/>
                                <Route path={'/location_products'} component={withAuth(LocationProducts)}/>
                                <Route path={'/profile'} component={withAuth(UserProfilePage)}/>
                                <Route component={ForbiddenPage}/>
                            </Switch>
                        </div>
                    </React.Fragment>
                );
            case "SHOP_MANAGER":
                return (
                    <React.Fragment>
                        <div>
                            <Switch>
                                <Route path={'/'} component={withAuth(InnerApplications)} exact={true}/>
                                <Route path={'/login'} component={Login}/>
                                <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)}/>
                                <Route path={'/bills'} component={withAuth(Bills)}/>
                                <Route path={'/location_products'} component={withAuth(LocationProducts)}/>
                                <Route path={'/innerapplications'} component={withAuth(InnerApplications)}/>
                                <Route path={'/profile'} component={withAuth(UserProfilePage)}/>
                                <Route component={ForbiddenPage}/>
                            </Switch>
                        </div>
                    </React.Fragment>
                );
            case ("DIRECTOR"):
                return (
                    <React.Fragment>
                        <div>
                            <Switch>
                                <Route path={'/'} component={withAuth(Bills)} exact={true}/>
                                <Route path={'/login'} component={Login}/>
                                <Route path={'/category'} component={withAuth(Category)}/>
                                <Route path={'/writeoffacts'} component={withAuth(WriteOffActs)}/>
                                <Route path={'/bills'} component={withAuth(Bills)}/>
                                <Route path={'/location_tax'} component={withAuth(LocationTax)}/>
                                <Route path={'/profile'} component={withAuth(UserProfilePage)}/>
                                <Route component={ForbiddenPage}/>
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
                        <Route component={Login}/>
                    </Switch>
                </div>
            </React.Fragment>
        );
    }
}
