import LocationModal from '../modals/LocationModal';
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

export default () => {
    const [locationsData, setData] = useState({
        isLoading: true,
        error: null,
        locations: [],
        displayModal: false,
    });

    useEffect(() => {
        fetch('http://localhost:8080/locations', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(locations => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    locations
                }));
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [locationsData.displayModal]);

    const { isLoading, error, locations, displayModal } = locationsData;

    return (
        <>
            {isLoading && 'Loading....'}
            {!isLoading && !error &&
                <Form onSubmit={removeLocations}>
                    {(locations.length != 0
                        ? <table border="1" width="100%">
                            <tr>
                                <th></th>
                                <th>Identifier</th>
                                <th>Type</th>
                                <th>Full address</th>
                                <th>Available/Total capacity</th>
                            </tr>
                            {locations.map(location => <Locations location={location} key={location.id} />)}
                        </table>
                        : 'Empty list')}
                    <Button onClick={() => setData((prevState) => ({
                        ...prevState,
                        displayModal: true
                    }))}>
                        Add location
                        </Button>
                    <Button type="submit">
                        Remove location
                        </Button>
                </Form>
            }
            {!isLoading && error && 'Error happens'}
            {displayModal && <LocationModal onClick={() => setData((prevState) => ({ ...prevState, displayModal: false }))} />}
        </>
    );
}

function removeLocations(e) {
    e.preventDefault();
    let locationIdList = [];
    e.target.locations.forEach(element => {
        element.checked && locationIdList.push({ id: element.value });
    });
    fetch('http://localhost:8080/locations', {
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
}

function Locations({ location }) {
    return (
        <tr id={location.id}>
            <td><input type="checkbox" value={location.id} name={"locations"} /></td>
            <td>{location.identifier}</td>
            <td>{location.locationType}</td>
            <td>{location.address.state.name}, {location.address.city}, {location.address.firstAddressLine}</td>
            <td>{location.availableCapacity}/{location.totalCapacity}</td>
        </tr>

    )
}