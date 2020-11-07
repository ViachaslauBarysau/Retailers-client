import UserModal from '../modals/UserModal';
import React, { useState, useEffect } from 'react';


export default () => {
    const [usersData, setData] = useState({
        isLoading: true,
        error: null,
        users: null
    });

    useEffect(() => {
        fetch('http://localhost:8080/users',
            {
                headers: {"Authorization": localStorage.getItem("token")},
                method: "GET"
            })
            .then(res => res.json())
            .then(users => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    users
                }));
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, []);

    const {isLoading, error, users} = usersData;
  
    return  (
      <>
      {isLoading && 'Loading....'}
      {!isLoading && !error &&
          (users != null
            ? users.map(user => <Users activateUser={() => setData({ ...usersData, activeUser: user })} user={user} key={user.id} />)
            : 'Empty list')
      }
      {!isLoading && error && 'Error happens'}
      {usersData.activeUser && <UserModal onClose={() => setData({ ...usersData, activeUser: null })} />}
      </>
    );
  }
  
  function Users({user, activateUser}){
    return (
      <div style={{marginTop: 10}}>
        <li>
          {user.id} <a href='#' onClick={activateUser}>{user.firstName}</a>
        </li>
        <hr />
      </div>
    )
  }

