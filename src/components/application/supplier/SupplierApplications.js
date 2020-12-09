import React, {useContext, useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import SupplierAppCreateModal from './modal/SupplierAppCreateModal';
import SupplierAppEditModal from "./modal/SupplierAppEditModal";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Pagination from "@material-ui/lab/Pagination";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import {AuthContext} from "../../../context/authContext";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import DateAndTime, {editToLocalTimeAndGet} from "../../../util/DateAndTime"

export default () => {
    const {logout} = useContext(AuthContext);
    const [applicationsData, setData] = useState({
        isLoading: false,
        error: null,
        applications: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1)
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

    const handleChangePage = (event, value) => {
        setPageNumber(value - 1);
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
            .then(res => res.json())
            .then(applicationsPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    applications: applicationsPage.content
                }));
                setPageCount(applicationsPage.totalPages);
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber, needRefresh]);

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
                                    <TableCell>Application number</TableCell>
                                    <TableCell>Supplier identifier</TableCell>
                                    <TableCell>Destination location</TableCell>
                                    <TableCell>Update date and time</TableCell>
                                    <TableCell>Last updated by</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {applications.map(application => <SupplierApplications application={application}
                                                                                       key={application.id}/>)}
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
                    Add application</Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
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
            <TableRow key={application.applicationNumber}>
                <TableCell component="th" scope="row">
                    <a href="#" onClick={() => setDisplayEditModal({
                        displayModal: true,
                        appId: application.id
                    })}>{application.applicationNumber}</a>
                </TableCell>
                <TableCell>{application.supplier.identifier}</TableCell>
                <TableCell>{application.destinationLocation.identifier}</TableCell>
                <TableCell>{editToLocalTimeAndGet(application.updatingDateTime)}</TableCell>
                <TableCell>{application.updater.firstName} {application.updater.lastName}</TableCell>
                <TableCell>{application.applicationStatus === "OPEN" ? "Open" : "Finished processing"}</TableCell>
            </TableRow>
        )
    }
}

