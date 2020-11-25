import UserModal from './UserModal';
import React, {useState, useEffect} from 'react';
import {Button, Form} from 'react-bootstrap';

export default () => {
    const [usersData, setData] = useState({
        isLoading: true,
        error: null,
        users: []
    });

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        userId: null
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
    }, []);

    const {isLoading, error, users} = usersData;

    return (
        <div>
            {isLoading && 'Loading....'}
            {!isLoading && !error &&
            <form onSubmit={changeUserStatus}>
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
                        {users.map(user => <Users user={user} key={user.id}/>)}
                        </tbody>
                    </table>
                    : 'Empty list')}
                <Button onClick={() => setDisplayCreateModal(true)}>
                    Add user
                </Button>
                <Button type="submit">
                    Enable/Disable
                </Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <UserModal onClick={() => setDisplayCreateModal(false)}/>}
        </div>
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

function Users({user}) {
    return (
        <tr>
            <td><input type="checkbox" value={user.id} name={"users"}/></td>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.birthday}</td>
            <td>{user.userRole}</td>
        </tr>
    )
}

