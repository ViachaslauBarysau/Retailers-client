import LocationCreateModal from './modal/LocationCreateModal';
import React, {useContext, useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import LocationEditModal from "./modal/LocationEditModal";
import Pagination from '@material-ui/lab/Pagination';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import {AuthContext} from "../../context/authContext";

export default () => {
    const {logout} = useContext(AuthContext);
    const [locationsData, setLocationsData] = useState({
        isLoading: false,
        error: null,
        locations: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1)
    const [needRefresh, setNeedRefresh] = useState(false);

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        locationId: null
    });

    const [selectedLocationsNumber, setSelectedLocationsNumber] = useState(0);

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
            setSelectedLocationsNumber(selectedLocationsNumber + 1);
        } else {
            setSelectedLocationsNumber(selectedLocationsNumber - 1);
        }
    }

    const handleChangePage = (event, value) => {
        setPageNumber(value - 1);
    };

    useEffect(() => {
        setLocationsData(prevState => ({...prevState, isLoading: true}));
        fetch('/api/locations?page=' + pageNumber + '&size=' + elementsOnPage, {
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
                setPageCount(locationsPage.totalPages);
            })
            .catch(e => {
                setLocationsData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber, needRefresh]);

    function removeLocations(e) {
        e.preventDefault();
        let locationIdList = [];
        e.target.locations.forEach(element => {
            element.checked && locationIdList.push(element.value);
        });
        fetch('/api/locations', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(
                locationIdList
            ),
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
                ;
            })
            .then(undeletedLocations => {
                if (undeletedLocations.length != 0) {
                    handleOpenSnackBar("Some locations haven't been deleted because " +
                        "they have open applications or active users.", "warning");
                } else {
                    handleOpenSnackBar("Deleted successfully!", "success");
                }
                setNeedRefresh(!needRefresh);
                setLocationsData((prevState) => ({...prevState, locations: []}))
            })
            .catch(e => {
                handleOpenSnackBar("Error happens!", "error");
            });
    }

    const {isLoading, error, locations} = locationsData;

    return (
        <div>
            {isLoading && <LinearProgress/>}
            {!isLoading && !error &&
            <form onSubmit={removeLocations}>
                {(locations.length !== 0
                    ? <TableContainer component={Paper}>
                        <Table size="small"
                               aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Identifier</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Full address</TableCell>
                                    <TableCell>Available/Total capacity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {locations.map(location => <Location
                                    key={location.id}
                                    location={location}
                                    onChange={handleChange}
                                    onClick={() => setDisplayEditModal({
                                        displayModal: true,
                                        locationId: location.id
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
                        onClick={() => setDisplayCreateModal(true)}>Add location</Button>
                <Button variant="contained"
                        type="submit"
                        disabled={selectedLocationsNumber === 0}>Remove location</Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <LocationCreateModal handleOpenSnackBar={(message, severity) =>
                                                            handleOpenSnackBar(message, severity)}
                                                        needrefresh={() => setNeedRefresh(!needRefresh)}
                                                        onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <LocationEditModal locationId={displayEditModal.locationId}
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
        <TableRow key={props.location.identifier}>
            <TableCell component="th" scope="row">
                <input type="checkbox"
                       value={props.location.id}
                       name="locations"
                       onChange={props.onChange}/>
            </TableCell>
            <TableCell><a href="#" onClick={props.onClick}>{props.location.identifier}</a></TableCell>
            <TableCell>{props.location.locationType}</TableCell>
            <TableCell>{props.location.address.state.name}, {props.location.address.city}, {props.location.address.firstAddressLine}</TableCell>
            <TableCell>{props.location.availableCapacity}/{props.location.totalCapacity}</TableCell>
        </TableRow>
    )
}

