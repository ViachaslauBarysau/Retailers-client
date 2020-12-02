import LocationCreateModal from './modal/LocationCreateModal';
import React, {useEffect, useState} from 'react';
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

export default () => {
    const [locationsData, setLocationsData] = useState({
        isLoading: true,
        error: null,
        locations: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, stPageCount] = useState(1)

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        locationId: null
    });

    const [selectedLocationsNumber, setSelectedLocationsNumber] = useState(0);

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


    function removeLocations(e) {
        e.preventDefault();
        let locationIdList = [];
        e.target.locations.forEach(element => {
            element.checked && locationIdList.push({id: element.value});
        });
        fetch('http://localhost:8080/api/locations', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(
                locationIdList
            ),
            method: "DELETE"
        });
        //TODO с бэка принять JSON в котором будет указано что мы не можем удалить конкретную позицию по причине.....
        //TODO логика ниже работает только при успешном удалении всех .then .catch
        setSelectedLocationsNumber(0);
    }

    useEffect(() => {
        fetch('http://localhost:8080/api/locations?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(locationsPage => {
                setLocationsData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    locations: locationsPage.content
                }));
                stPageCount(locationsPage.totalPages);
            })
            .catch(e => {
                setLocationsData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber]);

    const {isLoading, error, locations} = locationsData;

    return (
        <div>
            {isLoading && 'Loading....'}
            {!isLoading && !error &&
            <form onSubmit={removeLocations}>
                {(locations.length !== 0
                    ? <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
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
                <Pagination count={pageCount} showFirstButton showLastButton page={pageNumber + 1}
                            onChange={handleChangePage}/>
                <Button variant="contained" onClick={() => setDisplayCreateModal(true)}>
                    Add location
                </Button>
                <Button variant="contained" type="submit" disabled={selectedLocationsNumber === 0}>
                    Remove location
                </Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <LocationCreateModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <LocationEditModal locationId={displayEditModal.locationId}
                                                                 onCloseModal={() => setDisplayEditModal({
                                                                     displayModal: false,
                                                                     locationId: null
                                                                 })}
            />}
        </div>
    );
}

function Location(props) {
    return (
        <TableRow key={props.location.identifier}>
            <TableCell component="th" scope="row">
                <input type="checkbox"
                       value={props.location.id}
                       name={"locations"}
                       onChange={props.onChange}/>
            </TableCell>
            <TableCell><a href="#" onClick={props.onClick}>{props.location.identifier}</a></TableCell>
            <TableCell>{props.location.locationType}</TableCell>
            <TableCell>{props.location.address.state.name}, {props.location.address.city}, {props.location.address.firstAddressLine}</TableCell>
            <TableCell>{props.location.availableCapacity}/{props.location.totalCapacity}</TableCell>
        </TableRow>
    )
}

