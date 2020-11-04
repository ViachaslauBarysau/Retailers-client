import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
    user: JSON.parse(localStorage.getItem('user'))
});

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    return (
        <AuthContext.Provider value={{
            user,
            setUser: (user) => {
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user)
            },
            logout: () => {
                localStorage.setItem('user', JSON.stringify(null));
                setUser(null)
            }
        }}>
            {children}
        </AuthContext.Provider>
    )
}