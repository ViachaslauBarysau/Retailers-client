import React, {useContext, useEffect, useState} from 'react';
import InnerAppCreateModal from "./modal/InnerAppCreateModal";
import InnerAppEditModal from "./modal/InnerAppEditModal";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from '../../Button';
import TableContainer from "@material-ui/core/TableContainer";
import {StyledTableRow} from "../../Table"
import {StyledTableCell} from "../../Table"
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import {AuthContext} from "../../../context/authContext";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import {editToLocalTimeAndGet} from "../../../util/DateAndTime";
import TablePagination from "@material-ui/core/TablePagination";

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
        fetch('/api/inner_applications?page=' + pageNumber + '&size=' + elementsOnPage, {
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
                if (pageNumber > applicationsPage.totalPages === 0 && applicationsPage.totalPages - 1) {
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
                    ?
                    <TableContainer component={Paper}>
                        <Table size="small"
                               aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Application number</StyledTableCell>
                                    <StyledTableCell align="right">Source Location</StyledTableCell>
                                    <StyledTableCell align="right">Destination location</StyledTableCell>
                                    <StyledTableCell align="right">Update date and time</StyledTableCell>
                                    <StyledTableCell align="right">Last updated by</StyledTableCell>
                                    <StyledTableCell align="right">Status</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {applications.map(application => <InnerApplications application={application}
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
                    : 'Empty list')}
                <Button my={1} variant="contained"
                        onClick={() => setDisplayCreateModal(true)}>Add application</Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <InnerAppCreateModal handleOpenSnackBar={(message, severity) =>
                                                            handleOpenSnackBar(message, severity)}
                                                        needrefresh={() => setNeedRefresh(!needRefresh)}
                                                        onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <InnerAppEditModal appId={displayEditModal.appId}
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

    function InnerApplications({application}) {
        return (
            <StyledTableRow key={application.applicationNumber}>
                <StyledTableCell component="th" scope="row">
                    <a href="#" onClick={() => setDisplayEditModal({
                        displayModal: true,
                        appId: application.id
                    })}>{application.applicationNumber}</a>
                </StyledTableCell>
                <StyledTableCell align="right">{application.sourceLocation.identifier}</StyledTableCell>
                <StyledTableCell align="right">{application.destinationLocation.identifier}</StyledTableCell>
                <StyledTableCell align="right">{editToLocalTimeAndGet(application.updatingDateTime)}</StyledTableCell>
                <StyledTableCell align="right">{application.updater.firstName} {application.updater.lastName}</StyledTableCell>
                <StyledTableCell align="right">{application.applicationStatus === "OPEN" ? "Open" : "Finished processing"}</StyledTableCell>
            </StyledTableRow>
        )
    }
}

