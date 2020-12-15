import BillCreateModal from './modal/BillCreateModal';
import React, {useContext, useEffect, useState} from 'react';
import Button from '../Button';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import BillEditModal from "./modal/BillEditModal";
import {StyledTableCell, StyledTableRow} from "../Table"
import TablePagination from '@material-ui/core/TablePagination';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import {editToLocalTimeAndGet} from "../../util/DateAndTime";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {AuthContext} from "../../context/authContext";
import Typography from "@material-ui/core/Typography";

export default () => {
    const {user, logout} = useContext(AuthContext);
    const [billsData, setData] = useState({
        isLoading: false,
        error: null,
        bills: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [needRefresh, setNeedRefresh] = useState(false);

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        billId: null
    });

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

    const handleChangeRowsPerPage = (event) => {
        setElementsOnPage(+event.target.value);
        setPageNumber(0);
    };

    const handleChangePage = (event, newPage) => {
        setPageNumber(newPage);
    };

    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('/api/bills/' + (user.userRole[0] === "DIRECTOR" ? 'by_customer' : 'by_location') + '?page=' + pageNumber + '&size=' + elementsOnPage, {
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
            .then(billsPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    bills: billsPage.content
                }));
                setTotalElements(billsPage.totalElements)
                if (pageNumber > billsPage.totalPages === 0 && billsPage.totalPages - 1) {
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

    const {isLoading, error, bills} = billsData;

    return (
        <div>
            {isLoading && <LinearProgress/>}
            {!isLoading && !error &&
            (bills.length != 0
                ?
                <div>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Bill number</StyledTableCell>
                                    <StyledTableCell>Total amount of items</StyledTableCell>
                                    <StyledTableCell>Total price of items</StyledTableCell>
                                    <StyledTableCell>Date and Time</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bills.map(bill => <Bills bill={bill}
                                                          key={bill.id}/>)}
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

                </div>
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
                Add bill</Button>
            {!isLoading && error &&
            <Typography
                style={{
                    textAlign: 'center',
                    margin: '10px'
                }}
                variant='h6'
            >
                No records.
            </Typography>}
            {displayCreateModal && <BillCreateModal handleOpenSnackBar={(message, severity) =>
                handleOpenSnackBar(message, severity)}
                                                    needrefresh={() => setNeedRefresh(!needRefresh)}
                                                    onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <BillEditModal handleOpenSnackBar={(message, severity) =>
                handleOpenSnackBar(message, severity)}
                                                             needrefresh={() => setNeedRefresh(!needRefresh)}
                                                             billId={displayEditModal.billId}
                                                             onCloseModal={() => setDisplayEditModal({
                                                                 displayModal: false,
                                                                 billId: null
                                                             })}
            />}
            <Snackbar open={snackBar.display} autoHideDuration={6000} onClose={handleCloseSnackBar}>
                <Alert onClose={handleCloseSnackBar} severity={snackBar.severity}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
        </div>
    );

    function Bills({bill}) {
        return (
            <StyledTableRow key={bill.billNumber}>
                <StyledTableCell component="th" scope="row">
                    <a href="#" onClick={() => setDisplayEditModal({
                        displayModal: true,
                        billId: bill.id
                    })}
                    >{bill.billNumber}</a>
                </StyledTableCell>
                <StyledTableCell align="left">{bill.totalProductAmount}</StyledTableCell>
                <StyledTableCell align="left">{bill.totalPrice}</StyledTableCell>
                <StyledTableCell align="left">{editToLocalTimeAndGet(bill.registrationDateTime)}</StyledTableCell>
            </StyledTableRow>
        )
    }
}

