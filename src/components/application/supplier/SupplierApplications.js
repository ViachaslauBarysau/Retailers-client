import React, {useContext, useEffect, useState} from 'react';
import Button from '../../Button';
import SupplierAppCreateModal from './modal/SupplierAppCreateModal';
import SupplierAppEditModal from "./modal/SupplierAppEditModal";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import {StyledTableCell, StyledTableRow} from "../../Table"
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import {AuthContext} from "../../../context/authContext";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {editToLocalTimeAndGet} from "../../../util/DateAndTime"
import TablePagination from "@material-ui/core/TablePagination";
import Typography from "@material-ui/core/Typography";

export default () => {
    const {logout} = useContext(AuthContext);
    const [applicationsData, setData] = useState({
        isLoading: false,
        error: null,
        applications: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [needRefresh, setNeedRefresh] = useState(false);

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        appId: null
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
        fetch('/api/supplier_applications?page=' + pageNumber + '&size=' + elementsOnPage, {
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
            })
            .then(applicationsPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    applications: applicationsPage.content
                }));
                setTotalElements(applicationsPage.totalElements)
                if (pageNumber > applicationsPage.totalPages - 1 && pageNumber !== 0) {
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

    const {isLoading, error, applications} = applicationsData;

    return (
        <div>
            {isLoading && <LinearProgress/>}
            {!isLoading && !error &&
            <form>
                {(applications.length !== 0
                    ? <TableContainer component={Paper}>
                        <Table size="small"
                               aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Application number</StyledTableCell>
                                    <StyledTableCell>Supplier identifier</StyledTableCell>
                                    <StyledTableCell>Destination location</StyledTableCell>
                                    <StyledTableCell>Update date and time</StyledTableCell>
                                    <StyledTableCell>Last updated by</StyledTableCell>
                                    <StyledTableCell align="center">Status</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {applications.map(application => <SupplierApplications application={application}
                                                                                       key={application.id}/>)}
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
                    Add application</Button>
            </form>
            }
            {!isLoading && error && <Typography
                style={{
                    textAlign: 'center',
                    margin: '10px'
                }}
                variant='h6'
            >
                Error happens.
            </Typography>}
            {displayCreateModal && <SupplierAppCreateModal handleOpenSnackBar={(message, severity) =>
                handleOpenSnackBar(message, severity)}
                                                           needrefresh={() => setNeedRefresh(!needRefresh)}
                                                           onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <SupplierAppEditModal appId={displayEditModal.appId}
                                                                    handleOpenSnackBar={(message, severity) =>
                                                                        handleOpenSnackBar(message, severity)}
                                                                    needrefresh={() => setNeedRefresh(!needRefresh)}
                                                                    onCloseModal={() => setDisplayEditModal({
                                                                        displayModal: false,
                                                                        appId: null
                                                                    })}
            />}
            <Snackbar open={snackBar.display} autoHideDuration={6000} onClose={handleCloseSnackBar}>
                <Alert onClose={handleCloseSnackBar} severity={snackBar.severity}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
        </div>
    );

    function SupplierApplications({application}) {
        return (
            <StyledTableRow key={application.applicationNumber}>
                <StyledTableCell component="th" scope="row">
                    <a href="#" onClick={() => setDisplayEditModal({
                        displayModal: true,
                        appId: application.id
                    })}>{application.applicationNumber}</a>
                </StyledTableCell>
                <StyledTableCell>{application.supplierWarehouse.name}</StyledTableCell>
                <StyledTableCell>{application.destinationLocation.identifier}</StyledTableCell>
                <StyledTableCell>{editToLocalTimeAndGet(application.updatingDateTime)}</StyledTableCell>
                <StyledTableCell>{application.updater.firstName} {application.updater.lastName}</StyledTableCell>
                <StyledTableCell>{application.applicationStatus === "OPEN" ? "Open" : "Finished processing"}</StyledTableCell>
            </StyledTableRow>
        )
    }
}

