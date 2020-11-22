import LocationModal from './LocationModal';
import React, {useEffect, useState} from 'react';
import {Button, Form} from 'react-bootstrap';

export default () => {
    const [locationsData, setLocationsData] = useState({
        isLoading: true,
        error: null,
        locations: [],
        displayModal: false,
        checkedRecords: [],
        isDataOutdated: false
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
            <Form onSubmit={removeLocations}>
                {(locations.length !== 0
                    ? <table border="1" width="100%">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Identifier</th>
                            <th>Type</th>
                            <th>Full address</th>
                            <th>Available/Total capacity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {locations.map(location => <Location
                            key={location.id}
                            location={location}
                            onChange={handleChange}
                        />)}
                        </tbody>
                    </table>
                    : 'Empty list')}
                <Button onClick={() => setLocationsData((prevState) => ({
                    ...prevState,
                    displayModal: true
                }))}>
                    Add location
                </Button>
                <Button type="submit" disabled={locationsData.checkedRecords.length === 0}>
                    Remove location
                </Button>
            </Form>
            }
            {!isLoading && error && 'Error happens'}
            {displayModal &&
            <LocationModal onClick={() => setLocationsData((prevState) => ({...prevState, displayModal: false}))}/>}
        </>
    );
}


function Location(props) {

    return (
        <tr id={props.location.id}>
            <td><input type="checkbox"
                       value={props.location.id}
                       name={"locations"}
                       onChange={props.onChange}/></td>
            <td>{props.location.identifier}</td>
            <td>{props.location.locationType}</td>
            <td>{props.location.address.state.name}, {props.location.address.city}, {props.location.address.firstAddressLine}</td>
            <td>{props.location.availableCapacity}/{props.location.totalCapacity}</td>
        </tr>
    )
}