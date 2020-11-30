import '../../Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import StateSelect from '../../StateSelect';
import {TextField} from "@material-ui/core";

const LocationCreateModal = (props) => {
    const [stateId, setStateId] = useState(1);

    function updateStateSelectValue(id) {
        setStateId(id)
    }

    function addLocation(e) {
        e.preventDefault();
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
                            id: stateId,
                        },
                    city: e.target.city.value,
                    firstAddressLine: e.target.address1.value,
                    secondAddressLine: e.target.address2.value
                },
                totalCapacity: e.target.total_capacity.value,
                availableCapacity: e.target.total_capacity.value,
                locationType: e.target.type.value,
                locationTax: e.target.location_tax.value,
                status: "ACTIVE"
            }),
            method: "POST"
        });
        props.onCloseModal();
    }

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form onSubmit={addLocation}>
                    <TextField margin="dense" size="small" fullWidth={true} name="identifier" variant="outlined"
                               label="Identifier"
                               required/>
                    <label> State:
                        <StateSelect onChangeState={updateStateSelectValue}/>
                    </label>
                    <TextField margin="dense" size="small" fullWidth={true} name="city" variant="outlined" label="City"
                               required/>
                    <TextField margin="dense" size="small" fullWidth={true} name="address1" variant="outlined" label="Address line 1"
                               required/>
                    <TextField margin="dense" size="small" fullWidth={true} name="address2" variant="outlined" label="Address line 2"
                               required/>
                    <label> Type:
                        <select id="type">
                            <option value="WAREHOUSE">Warehouse</option>
                            <option value="SHOP">Shop</option>
                        </select>
                    </label>
                    <br />
                    <TextField margin="dense" size="small" fullWidth={true} name="total_capacity" variant="outlined" label="Total capacity"
                               required/>
                    <TextField margin="dense" size="small" fullWidth={true} name="location_tax" variant="outlined" label="Location tax"
                               required/>
                    <input type="submit" value="Add location" />
                    <input id="closeButton" type="button" onClick={props.onCloseModal} value="Close" />
                </form>
            </div>
        </div>
    )
}


export default LocationCreateModal;