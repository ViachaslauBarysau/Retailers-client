import UserModal from './modal/UserModal';
import React, {useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";

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
                    ? <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Full name</TableCell>
                                    <TableCell>Birthday</TableCell>
                                    <TableCell>Role</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map(user => <Users user={user} key={user.id}/>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : 'Empty list')}
                <Button variant="contained"  onClick={() => setDisplayCreateModal(true)}>
                    Add user
                </Button>
                <Button variant="contained"  type="submit">
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
        <TableRow key={user.id}>
            <TableCell component="th" scope="row">
                <input type="checkbox" value={user.id} name={"users"}/>
            </TableCell>
            <TableCell>{user.firstName} {user.lastName}</TableCell>
            <TableCell>{user.birthday}</TableCell>
            <TableCell>{user.userRole}</TableCell>
        </TableRow>
    )
}

