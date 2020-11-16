import './Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import StateSelect from './formComponents/StateSelect';

const LocationModal = (props) => {
    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onClick} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form onSubmit={addLocation}>
                    <label> Identifier:
                        <input type="text" id="identifier" />
                    </label>
                    <br />
                    <label> State:
                        <StateSelect />
                    </label>
                    <br />
                    <label> City:
                        <input type="text" id="city" />
                    </label>
                    <br />
                    <label> Address line 1:
                        <input type="text" id="address1" />
                    </label>
                    <br />
                    <label> Address line 2:
                        <input type="text" id="address2" />
                    </label>
                    <br />
                    <label> Type:
                        <select id="type">
                            <option value="WAREHOUSE">Warehouse</option>
                            <option value="SHOP">Shop</option>
                        </select>
                    </label>
                    <br />
                    <label> Total capacity:
                        <input type="text" id="total_capacity" />
                    </label>
                    <br />
                    <label> Available capacity:
                        <input type="text" id="available_capacity" />
                    </label>
                    <br />
                    <label> Location tax:
                        <input type="text" id="location_tax" />
                    </label>
                    <br />
                    <input type="submit" value="Add location" />
                    <input id="closeButton" type="button" onClick={props.onClick} value="Close" />
                </form>
            </div>
        </div>
    )
}

function addLocation(e) {
    e.preventDefault();
    fetch('http://localhost:8080/locations', {
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