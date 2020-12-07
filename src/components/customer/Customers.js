import CustomerCreateModal from './modal/CustomerCreateModal';
import CustomerEditModal from './modal/CustomerEditModal';
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
import LinearProgress from "@material-ui/core/LinearProgress";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

export default function Customers() {
    const [customersData, setData] = useState({
        isLoading: false,
        error: null,
        customers: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1)
    const [needRefresh, setNeedRefresh] = useState(false);

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        customerId: null
    });

    const [selectedCustomersNumber, setSelectedCustomersNumber] = useState(0);

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
            setSelectedCustomersNumber(selectedCustomersNumber + 1);
        } else {
            setSelectedCustomersNumber(selectedCustomersNumber - 1);
        }
    }

    const handleChangePage = (event, value) => {
        setPageNumber(value - 1);
    };

    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('/api/customers?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(customersPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    customers: customersPage.content
                }));
                setPageCount(customersPage.totalPages);
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber, needRefresh]);

    const {isLoading, error, customers} = customersData;

    function changeCustomerStatus(e) {
        e.preventDefault();
        let customerIdList = [];
        e.target.customers.forEach(element => {
            element.checked && customerIdList.push(Number(element.value));
        });

        fetch('/api/customers', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(customerIdList),
            method: "DELETE"
        })
            .then(res => res.json())
            .then(() => {
                handleOpenSnackBar("Completed successfully!", "success");
                setNeedRefresh(!needRefresh);
                setData((prevState) => ({...prevState, customers: []}))
            } )
            .catch(e => {
                handleOpenSnackBar("Error happens!", "error");
            });
    }

    return (
        <div>
            {isLoading && <LinearProgress/>}
            {!isLoading && !error &&
            <form onSubmit={changeCustomerStatus}>
                {(customers.length !== 0
                    ? <TableContainer component={Paper}>
                        <Table size="small"
                               aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Registration date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Admin's email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {customers.map(customer => <Customer customer={customer}
                                                                     key={customer.id}
                                                                     onChange={handleChange}
                                                                     onClick={() => setDisplayEditModal({
                                                                         displayModal: true,
                                                                         customerId: customer.id
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
                        onClick={() => setDisplayCreateModal(true)}>
                    Add customer
                </Button>
                <Button variant="contained"
                        type="submit"
                        disabled={selectedCustomersNumber === 0}>
                    Enable/Disable
                </Button>
            </form>

            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <CustomerCreateModal handleOpenSnackBar={(message, severity) => handleOpenSnackBar(message, severity)}
                                                        needrefresh={() => setNeedRefresh(!needRefresh)}
                                                        onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <CustomerEditModal customerId={displayEditModal.customerId}
                                                                 onCloseModal={() => setDisplayEditModal({
                                                                     displayModal: false,
                                                                     customerId: null
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

function Customer(props) {
    return (
        <TableRow key={props.customer.id}>
            <TableCell component="th" scope="row">
                <input type="checkbox"
                       value={props.customer.id}
                       name={"customers"}
                       onChange={props.onChange}/>
            </TableCell>
            <TableCell>
                <a href="#" onClick={props.onClick}>{props.customer.name}</a>
            </TableCell>
            <TableCell>{props.customer.registrationDate}</TableCell>
            <TableCell>{props.customer.customerStatus}</TableCell>
            <TableCell>{props.customer.email}</TableCell>
        </TableRow>
    )
}