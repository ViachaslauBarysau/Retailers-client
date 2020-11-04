import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

// here we're going to keep authorized user
import AuthContextProvider from "./context/authContext";

ReactDOM.render(
    <BrowserRouter>
        <AuthContextProvider>
            <App/>
        </AuthContextProvider>
    </BrowserRouter>,
    document.getElementById('root')
);

