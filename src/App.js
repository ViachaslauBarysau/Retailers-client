import React from 'react';

import Routes from './components/Routes';

import Navigation from './components/Navigation';

function App() {
    return (
        <React.Fragment>
            <Navigation />
            <Routes />
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