import React from 'react';
import { Switch, Route, Link } from "react-router-dom";



import ProtectedComponent from "./components/ProtectedComponent";
import withAuth from "./hoc/withAuth";


import Index from './pages/Index';
import Login from './pages/Login';
import Users from './pages/Users';

import Navigation from './components/Navigation';


const ProtectedPostsPageWithHOC = withAuth(Users);

function App() {
    return (
        <React.Fragment>
            <Navigation/>
            <div>
                <Switch>
                    <Route path={'/'} component={Index} exact={true}/>
                    <Route path={'/index'} component={Index}/>
                    <Route path={'/users'} component={ProtectedPostsPageWithHOC}/>
                    <Route path={'/login'} component={Login}/>
                </Switch>
            </div>
        </React.Fragment>
    )
}

export default App;

// 02 - Render prop pattern
/*
/// PUT THIS ROUTER TO SHOW RENDR PROPS PATTERN
<Route path={'/admin'}
       render={() => {
           return <ProtectedComponent render={(user => {
               console.log(user);
               return <Admin/>
           })}/>
       }}/>
*/