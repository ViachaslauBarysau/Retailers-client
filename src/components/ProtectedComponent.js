import React, { useContext } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

export default function ProtectedComponent({render}) {
    const location = useLocation();
    const { user } = useContext(AuthContext);

    return user
        ? render(user)
        : <Redirect to={{
            pathname: '/login',
            state: { from: location.pathname }
        }}/>
}