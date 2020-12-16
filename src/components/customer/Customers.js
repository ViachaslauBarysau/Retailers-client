import CustomerCreateModal from './modal/CustomerCreateModal';
import CustomerEditModal from './modal/CustomerEditModal';
import React, {useContext, useEffect, useState} from 'react';
import Button from '../Button';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import {StyledTableCell, StyledTableRow} from "../Table"
import LinearProgress from "@material-ui/core/LinearProgress";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import {AuthContext} from "../../context/authContext";
import TablePagination from "@material-ui/core/TablePagination";
import Typography from "@material-ui/core/Typography";

export default function Customers() {
    const {logout} = useContext(AuthContext);
    const [customersData, setData] = useState({
        isLoading: false,
        error: null,
        customers: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);


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

    const handleChangeRowsPerPage = (event) => {
        setElementsOnPage(+event.target.value);
        setPageNumber(0);
    };

    const handleChangePage = (event, newPage) => {
        setPageNumber(newPage);
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
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
                ;
            })
            .then(customersPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    customers: customersPage.content
                }));
                setTotalElements(customersPage.totalElements)
                if (pageNumber > customersPage.totalPages - 1 && pageNumber !== 0) {
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

    const {isLoading, error, customers} = customersData;

    function changeCustomerStatus(e) {
        e.preventDefault();
        let customerIdList = [];
        if (e.target.customers.length === undefined) {
            e.target.customers.checked && customerIdList.push(Number(e.target.customers.value));
        } else {
            e.target.customers.forEach(element => {
                element.checked && customerIdList.push(Number(element.value));
            });
        }

        fetch('/api/customers', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(customerIdList),
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .then(() => {
                handleOpenSnackBar("Completed successfully!", "success");
                setNeedRefresh(!needRefresh);
                setData((prevState) => ({...prevState, customers: []}))
            })
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
                                    <StyledTableCell width={10}></StyledTableCell>
                                    <StyledTableCell>Name</StyledTableCell>
                                    <StyledTableCell align="right">Registration date</StyledTableCell>
                                    <StyledTableCell align="right">Status</StyledTableCell>
                                    <StyledTableCell align="right">Admin's email</StyledTableCell>
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
                    : <Typography
                        style={{
                            textAlign: 'center',
                            margin: '10px'
                        }}
                        variant='h6'
                    >
                        No records.
                    </Typography>)}
                <Button my={1} variant="contained"
                        onClick={() => setDisplayCreateModal(true)}>
                    Add customer
                </Button>
                <Button m={1} variant="contained"
                        type="submit"
                        disabled={selectedCustomersNumber === 0}>
                    Enable/Disable
                </Button>
            </form>

            }
            {!isLoading && error &&
            <Typography
                style={{
                    textAlign: 'center',
                    margin: '10px'
                }}
                variant='h6'
            >
                Error happens.
            </Typography>}
            {displayCreateModal && <CustomerCreateModal handleOpenSnackBar={(message, severity) =>
                handleOpenSnackBar(message, severity)}
                                                        needrefresh={() => setNeedRefresh(!needRefresh)}
                                                        onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <CustomerEditModal customerId={displayEditModal.customerId}
                                                                 handleOpenSnackBar={(message, severity) =>
                                                                     handleOpenSnackBar(message, severity)}
                                                                 needrefresh={() => setNeedRefresh(!needRefresh)}
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
        <StyledTableRow key={props.customer.id}>
            <StyledTableCell component="th" scope="row">
                <input type="checkbox"
                       value={props.customer.id}
                       name={"customers"}
                       onChange={props.onChange}/>
            </StyledTableCell>
            <StyledTableCell>
                <a href="#" onClick={props.onClick}>{props.customer.name}</a>
            </StyledTableCell>
            <StyledTableCell align="right">{props.customer.registrationDate}</StyledTableCell>
            <StyledTableCell align="right">{props.customer.customerStatus}</StyledTableCell>
            <StyledTableCell align="right">{props.customer.email}</StyledTableCell>
        </StyledTableRow>
    )
}