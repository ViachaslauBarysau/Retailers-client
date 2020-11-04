//import { UserModal } from '../modals/UserModal';
import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';

export default () => {
    const [usersData, setData] = useState({
        isLoading: false,
        error: null,
        users: null
    });

useEffect(()=>{
    setData(prevState => ({...prevState, isLoading: true}));
       fetch('http://localhost:8080/users/')
        .then(res => res.json())
        .then(users => {
          setData((prevState)=>({
            ...prevState,
            isLoading: false,
            users
          }));
      })
      .catch(e => {
        setData((prevState)=>({
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
          ? users.map(user => <Users user={user} key={user.id}/>)
          
          : 'Empty list')
    }
    {!isLoading && error && 'Error happens'}
    {UserModal()}
    </>

  );
}

function Users({user}){
  return (
    <div style={{marginTop: 10}}>
      <li>{user.id}</li>
      <a href={'/users/' + user.id} style={{fontSize: 10, color: "blue", float: "right", marginRight: 5, marginTop: -5}}>Read more</a>
      <hr />
    </div>
  )
}

const openModal = () => {
    console.log("Open Modal");
}

function UserModal(){
    return (
 //       <Button onClick={openModal}>asdas</Button>

      <div>
        <button onClick={openModal}>OpenModal</button>
      </div>

    )
  }