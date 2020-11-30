import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

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
                localStorage.setItem('token', JSON.stringify(null));
                setUser(null);
                fetch('http://localhost:8080/api/logout', {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    },
                    method: "post"
                });
            }
        }}>
            {children}
        </AuthContext.Provider>
    )
}