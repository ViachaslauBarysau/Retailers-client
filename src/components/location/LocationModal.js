import '../../modals/Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import StateSelect from '../../modals/formSelects/StateSelect';
import {TextField} from "@material-ui/core";

const LocationModal = (props) => {
    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form onSubmit={addLocation}>
                    <TextField margin="dense" size="small" fullWidth={true} id="identifier" variant="outlined"
                               label="Identifier"
                               required/>
                    <label> State:
                        <StateSelect />
                    </label>
                    <TextField margin="dense" size="small" fullWidth={true} id="city" variant="outlined" label="City"
                               required/>
                    <TextField margin="dense" size="small" fullWidth={true} id="address1" variant="outlined" label="Address line 1"
                               required/>
                    <TextField margin="dense" size="small" fullWidth={true} id="address2" variant="outlined" label="Address line 2"
                               required/>
                    <label> Type:
                        <select id="type">
                            <option value="WAREHOUSE">Warehouse</option>
                            <option value="SHOP">Shop</option>
                        </select>
                    </label>
                    <br />
                    <TextField margin="dense" size="small" fullWidth={true} id="total_capacity" variant="outlined" label="Total capacity"
                               required/>
                    <TextField margin="dense" size="small" fullWidth={true} id="available_capacity" variant="outlined" label="Available capacity"
                               required/>
                    <TextField margin="dense" size="small" fullWidth={true} id="location_tax" variant="outlined" label="Location tax"
                               required/>
                    <input type="submit" value="Add location" />
                    <input id="closeButton" type="button" onClick={props.onCloseModal} value="Close" />
                </form>
            </div>
        </div>
    )
}

function addLocation(e) {
    e.preventDefault();
    console.log(e.target.state)
    fetch('http://localhost:8080/api/locations', {
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            identifier: e.target.identifier.value,
            customer: {
                id: JSON.parse(localStorage.getItem("user")).customer.id
            },
            address: {
                state:
                {
                    id: e.target.state.value
                },
                city: e.target.city.value,
                firstAddressLine: e.target.address1.value,
                secondAddressLine: e.target.address2.value
            },
            totalCapacity: e.target.total_capacity.value,
            availableCapacity: e.target.available_capacity.value,
            locationType: e.target.type.value,
            locationTax: e.target.location_tax.value
        }),
        method: "POST"
    });
    e.target.closeButton.click();
}

export default LocationModal;