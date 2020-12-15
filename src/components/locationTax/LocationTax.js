import React, {useContext, useEffect, useState} from 'react';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import {AuthContext} from "../../context/authContext";
import TablePagination from "@material-ui/core/TablePagination";
import {StyledTableCell, StyledTableRow} from "../Table";
import LocationTaxEditModal from "./modal/LocationTaxEditModal";
import Typography from "@material-ui/core/Typography";

export default () => {
    const {logout} = useContext(AuthContext);
    const [locationsData, setLocationsData] = useState({
        isLoading: false,
        error: null,
        locations: [],
    });

    const [totalElements, setTotalElements] = useState(0);
    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);


    const [needRefresh, setNeedRefresh] = useState(false);

    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        locationId: null
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
        setLocationsData(prevState => ({...prevState, isLoading: true}));
        fetch('/api/locations/shops?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                'Authorization': localStorage.getItem("token"),
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
            .then(locationsPage => {
                setLocationsData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    locations: locationsPage.content
                }));
                setTotalElements(locationsPage.totalElements)
                if (pageNumber > locationsPage.totalPages === 0 && locationsPage.totalPages - 1) {
                    setPageNumber(pageNumber - 1);
                }
            })
            .catch(e => {
                setLocationsData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber, needRefresh, elementsOnPage]);

    const {isLoading, error, locations} = locationsData;

    return (
        <div>
            {isLoading && <LinearProgress/>}
            {!isLoading && !error &&
            <form>
                {(locations.length !== 0
                    ? <TableContainer component={Paper}>
                        <Table size="small"
                               aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Identifier</StyledTableCell>
                                    <StyledTableCell>State tax rate</StyledTableCell>
                                    <StyledTableCell>Location tax rate</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {locations.map(location => <Location
                                    key={location.id}
                                    location={location}
                                    onClick={() => setDisplayEditModal({
                                        displayModal: true,
                                        locationId: location.id
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
            {displayEditModal.displayModal && <LocationTaxEditModal locationId={displayEditModal.locationId}
                                                                    handleOpenSnackBar={(message, severity) =>
                                                                        handleOpenSnackBar(message, severity)}
                                                                    needrefresh={() => setNeedRefresh(!needRefresh)}
                                                                    onCloseModal={() => setDisplayEditModal({
                                                                        displayModal: false,
                                                                        locationId: null
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

function Location(props) {
    return (
        <StyledTableRow key={props.location.identifier}>
            <StyledTableCell><a href="#" onClick={props.onClick}>{props.location.identifier}</a></StyledTableCell>
            <StyledTableCell>{props.location.address.state.stateTax}</StyledTableCell>
            <StyledTableCell>{props.location.locationTax}</StyledTableCell>
        </StyledTableRow>
    )
}

