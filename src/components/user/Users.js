import UserCreateModal from './modal/UserCreateModal';
import UserEditModal from './modal/UserEditModal';
import React, {useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Pagination from "@material-ui/lab/Pagination";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

export default () => {
    const [usersData, setData] = useState({
        isLoading: false,
        error: null,
        users: []
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1)

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        userId: null
    });

    const [selectedUsersNumber, setSelectedUsersNumber] = useState(0);

    function handleChange(e) {
        if (e.target.checked) {
            setSelectedUsersNumber(selectedUsersNumber + 1);
        } else {
            setSelectedUsersNumber(selectedUsersNumber - 1);
        }
    }

    const handleChangePage = (event, value) => {
        setPageNumber(value - 1);
    };

    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('http://localhost:8080/api/users?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(usersPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    users: usersPage.content
                }));
                setPageCount(usersPage.totalPages);
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber]);

    const {isLoading, error, users} = usersData;

    return (
        <div>
            {isLoading && <LinearProgress/>}
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
                                {users.map(user => <User
                                    user={user}
                                    key={user.id}
                                    onChange={handleChange}
                                    onClick={() => setDisplayEditModal({
                                        displayModal: true,
                                        userId: user.id
                                    })}
                                />)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : 'Empty list')}
                <Pagination count={pageCount}
                            showFirstButton
                            showLastButton
                            page={pageNumber + 1}
                            onChange={handleChangePage}/>
                <Button variant="contained"
                        onClick={() => setDisplayCreateModal(true)}>Add user</Button>
                <Button variant="contained"
                        type="submit"
                        disabled={selectedUsersNumber === 0}>Enable/Disable</Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <UserCreateModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <UserEditModal userId={displayEditModal.userId}
                                                             onCloseModal={() => setDisplayEditModal({
                                                                 displayModal: false,
                                                                 userId: null
                                                             })}
            />}
        </div>
    );
}

function changeUserStatus(e) {
    e.preventDefault();
    let userIdList = [];
    e.target.users.forEach(element => {
        element.checked && userIdList.push(element.value);
    });
    fetch('/api/users', {
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(userIdList),
        method: "DELETE"
    });
}

function User(props) {
    return (
        <TableRow key={props.user.id}>
            <TableCell component="th" scope="row">
                <input type="checkbox"
                       value={props.user.id}
                       name={"users"}
                       onChange={props.onChange}/>
            </TableCell>
            <TableCell><a href="#" onClick={props.onClick}>{props.user.firstName} {props.user.lastName}</a></TableCell>
            <TableCell>{props.user.birthday}</TableCell>
            <TableCell>{props.user.userRole}</TableCell>
        </TableRow>
    )
}

