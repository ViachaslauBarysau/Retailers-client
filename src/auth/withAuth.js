import React, { useContext } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

export default function withAuth(Component) {
    return (props) => {
        const location = useLocation();
        const { user } = useContext(AuthContext);

        return user
            ? <Component {...props} user={user}/>
            : <Redirect to={{
                pathname: '/login',
                state: { from: location.pathname }
            }}/>
    }
}