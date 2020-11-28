import LocationModal from './LocationModal';
import React, {useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import LocationEditModal from "./LocationEditModal";

export default () => {
    const [locationsData, setLocationsData] = useState({
        isLoading: true,
        error: null,
        locations: [],
        checkedRecords: [],
        isDataOutdated: false
    });

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        locationId: null
    });

    const [selectedLocations, setSelectedLocations] = useState({});

    function handleChange(e) {
        if (e.target.checked) {
            let checkedRecords = locationsData.checkedRecords;
            checkedRecords.push(e.target.value);
            setLocationsData((prevState) => ({
                    ...prevState,
                    checkedRecords
                })
            );
        } else {
            let checkedRecords = locationsData.checkedRecords;
            checkedRecords = locationsData.checkedRecords.filter(elem => elem !== e.target.value);

            setLocationsData((prevState) => ({
                    ...prevState,
                    checkedRecords
                })
            );
        }
    }

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
        setLocationsData(
            (prevState) => ({
                ...prevState,
                checkedRecords: [],
                isDataOutdated: !locationsData.isDataOutdated
            })
        );
    }

    useEffect(() => {
        fetch('http://localhost:8080/api/locations', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(locations => {
                setLocationsData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    locations
                }));
            })
            .catch(e => {
                setLocationsData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [locationsData.displayModal, locationsData.isDataOutdated]);

    const {isLoading, error, locations, displayModal} = locationsData;

    return (
        <>
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
                                />)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : 'Empty list')}
                <Button variant="contained" onClick={() => setDisplayCreateModal(true)}>
                    Add location
                </Button>
                <Button variant="contained" type="submit" disabled={locationsData.checkedRecords.length === 0}>
                    Remove location
                </Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <LocationModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <LocationEditModal locationId={displayEditModal.locationId}
                                                                    onCloseModal={() => setDisplayEditModal({
                                                                        displayModal: false,
                                                                        locationId: null
                                                                    })}
            />}
        </>
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
            <TableCell>{props.location.identifier}</TableCell>
            <TableCell>{props.location.locationType}</TableCell>
            <TableCell>{props.location.address.state.name}, {props.location.address.city}, {props.location.address.firstAddressLine}</TableCell>
            <TableCell>{props.location.availableCapacity}/{props.location.totalCapacity}</TableCell>
        </TableRow>
    )
}