import UserCreateModal from './modal/UserCreateModal';
import UserEditModal from './modal/UserEditModal';
import React, {useContext, useEffect, useState} from 'react';
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
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import {AuthContext} from "../../context/authContext";
import TablePagination from "@material-ui/core/TablePagination";

export default () => {
    const {logout} = useContext(AuthContext);
    const [usersData, setData] = useState({
        isLoading: false,
        error: null,
        users: []
    });

    const [pageNumber, setPageNumber] = useState(0);
    const [elementsOnPage, setElementsOnPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const [needRefresh, setNeedRefresh] = useState(false);

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        userId: null
    });

    const [selectedUsersNumber, setSelectedUsersNumber] = useState(0);

    const [snackBar, setSnackBar] = useState({
        display: false,
        message: "",
        severity: "success"
    });

    const handleOpenSnackBar = (message, severity) => {
        setSnackBar({
            display: true,
            message,
            severity
        });
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({
            display: false,
            message: ""
        });
    };

    function handleChange(e) {
        if (e.target.checked) {
            setSelectedUsersNumber(selectedUsersNumber + 1);
        } else {
            setSelectedUsersNumber(selectedUsersNumber - 1);
        }
    }

    const handleChangeRowsPerPage = (event) => {
        setElementsOnPage(+event.target.value);
        setPageNumber(0);
    };

    const handleChangePage = (event, newPage) => {
        setPageNumber(newPage);
    };

    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('/api/users?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .then(usersPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    users: usersPage.content
                }));
                setTotalElements(usersPage.totalElements)
                if (pageNumber > usersPage.totalPages - 1) {
                    setPageNumber(pageNumber - 1);
                }
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber, needRefresh, elementsOnPage]);

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
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .then(users => {
                console.log(users)
                if (users.length != 0) {
                    handleOpenSnackBar("Some user's status haven't been changed to ACTIVE because " +
                        "they assigned to deleted locations.", "warning");
                } else {
                    handleOpenSnackBar("Completed successfully!", "success");
                }
                setNeedRefresh(!needRefresh);
                setData((prevState) => ({...prevState, users: []}))
            })
            .catch(e => {
                handleOpenSnackBar("Error happens!", "error");
            });
    }

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
                                    <TableCell width={10}></TableCell>
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
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 20]}
                            component="div"
                            count={totalElements}
                            page={pageNumber}
                            onChangePage={handleChangePage}
                            rowsPerPage={elementsOnPage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                    : 'Empty list')}
                <Button variant="contained"
                        onClick={() => setDisplayCreateModal(true)}>Add user</Button>
                <Button variant="contained"
                        type="submit"
                        disabled={selectedUsersNumber === 0}>Enable/Disable</Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <UserCreateModal handleOpenSnackBar={(message, severity) =>
                handleOpenSnackBar(message, severity)}
                                                    needrefresh={() => setNeedRefresh(!needRefresh)}
                                                    onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <UserEditModal userId={displayEditModal.userId}
                                                             handleOpenSnackBar={(message, severity) =>
                                                                 handleOpenSnackBar(message, severity)}
                                                             needrefresh={() => setNeedRefresh(!needRefresh)}
                                                             onCloseModal={() => setDisplayEditModal({
                                                                 displayModal: false,
                                                                 userId: null
                                                             })}
            />}
            <Snackbar open={snackBar.display} autoHideDuration={6000} onClose={handleCloseSnackBar}>
                <Alert onClose={handleCloseSnackBar} severity={snackBar.severity}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
        </div>
    );
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

