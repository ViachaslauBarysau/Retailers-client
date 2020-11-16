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
                (locations.length != 0
                    ? <Form onSubmit={removeLocations}>
                        {locations.map(location => <Locations location={location} key={location.id} />)}
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
                    : 'Empty list')
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
        <p><label><input type="checkbox" value={location.id} name={"locations"} />
            <span>{location.identifier} - {location.locationType} - {location.address.state.name}, {location.address.city}, {location.address.firstAddressLine}   {location.availableCapacity}/{location.totalCapacity}-</span></label></p>
    )
}