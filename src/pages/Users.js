import UserModal from '../modals/UserModal';
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

export default () => {
  const [usersData, setData] = useState({
    isLoading: true,
    error: null,
    users: [],
    displayModal: false,
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/users', {
      headers: {
        "Authorization": localStorage.getItem("token")
      },
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
  }, [usersData.displayModal]);

  const { isLoading, error, users, displayModal } = usersData;



  return (
    <>
      {isLoading && 'Loading....'}
      {!isLoading && !error &&
        <Form onSubmit={changeUserStatus}>
          {(users.length != 0
            ? <table border="1" width="100%">
              <thead>
                <tr>
                  <th></th>
                  <th>Full name</th>
                  <th>Birthday</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => <Users user={user} key={user.id} />)}
              </tbody>
            </table>
            : 'Empty list')}
          <Button onClick={() => setData((prevState) => ({
            ...prevState,
            displayModal: true
          }))}>
            Add user
            </Button>
          <Button type="submit">
            Enable/Disable
            </Button>
        </Form>
      }
      {!isLoading && error && 'Error happens'}
      {displayModal && <UserModal onClick={() => setData((prevState) => ({ ...prevState, displayModal: false }))} />}
    </>
  );
}

function changeUserStatus(e) {
  e.preventDefault();
  let userIdList = [];
  e.target.users.forEach(element => {
    element.checked && userIdList.push(element.value);
  });
  fetch('http://localhost:8080/users', {
    headers: {
      'Authorization': localStorage.getItem("token"),
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(userIdList),
    method: "PUT"
  });
}

function Users({ user }) {
  return (
    <tr id={user.id}>
      <td><input type="checkbox" value={user.id} name={"users"} /></td>
      <td>{user.firstName} {user.lastName}</td>
      <td>{user.birthday}</td>
      <td>{user.userRole}</td>
    </tr>
  )
}

