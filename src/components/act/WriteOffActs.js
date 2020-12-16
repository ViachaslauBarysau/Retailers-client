import ActCreateModal from './modal/ActCreateModal';
import ActEditModal from './modal/ActEditModal';
import React, {useContext, useEffect, useState} from 'react';
import Button from '../Button';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {StyledTableCell, StyledTableRow} from "../Table"
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import {editToLocalTimeAndGet} from "../../util/DateAndTime";
import TablePagination from "@material-ui/core/TablePagination";
import LinearProgress from "@material-ui/core/LinearProgress";
import {AuthContext} from "../../context/authContext";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";

export default () => {
    const {user, logout} = useContext(AuthContext);
    const [actsData, setData] = useState({
        isLoading: false,
        error: null,
        acts: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [needRefresh, setNeedRefresh] = useState(false);

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        actId: null
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
        fetch('/api/write_off_acts/' + (user.userRole[0] === "DIRECTOR" ? 'by_customer' : 'by_location') + '?page='
            + pageNumber + '&size=' + elementsOnPage, {
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
            .then(actsPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    acts: actsPage.content
                }));
                setTotalElements(actsPage.totalElements)
                if (pageNumber > actsPage.totalPages - 1 && pageNumber !== 0) {
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

    const {isLoading, error, acts} = actsData;

    return (
        <div>
            {isLoading && <LinearProgress/>}
            {!isLoading && !error &&
            (acts.length != 0
                    ? <TableContainer component={Paper}>
                        <Table size="small"
                               aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Identifier</StyledTableCell>
                                    <StyledTableCell>Date and Time</StyledTableCell>
                                    <StyledTableCell>Total amount of products</StyledTableCell>
                                    <StyledTableCell>Total price of products</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {acts.map(act => <Acts act={act} key={act.id}/>)}
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
                    </Typography>
            )}
            {user.userRole[0] !== "DIRECTOR" &&
            <Button mt={1} variant="contained"
                    onClick={() => setDisplayCreateModal(true)}>
                Add write-off act</Button>
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
            {displayCreateModal && <ActCreateModal handleOpenSnackBar={(message, severity) =>
                handleOpenSnackBar(message, severity)}
                                                   needrefresh={() => setNeedRefresh(!needRefresh)}
                                                   onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <ActEditModal actId={displayEditModal.actId}
                                                            handleOpenSnackBar={(message, severity) =>
                                                                handleOpenSnackBar(message, severity)}
                                                            needrefresh={() => setNeedRefresh(!needRefresh)}
                                                            onCloseModal={() => setDisplayEditModal({
                                                                displayModal: false,
                                                                actId: null
                                                            })}
            />}
            <Snackbar open={snackBar.display} autoHideDuration={6000} onClose={handleCloseSnackBar}>
                <Alert onClose={handleCloseSnackBar} severity={snackBar.severity}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
        </div>
    );

    function Acts({act}) {
        return (
            <StyledTableRow>
                <StyledTableCell>
                    <a href="#" onClick={() => setDisplayEditModal({
                        displayModal: true,
                        actId: act.id
                    })}>{act.writeOffActNumber}</a>
                </StyledTableCell>
                <StyledTableCell>{editToLocalTimeAndGet(act.actDateTime)}</StyledTableCell>
                <StyledTableCell>{act.totalProductAmount}</StyledTableCell>
                <StyledTableCell>{act.totalProductSum}</StyledTableCell>
            </StyledTableRow>
        )
    }
}

