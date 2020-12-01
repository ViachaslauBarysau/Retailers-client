import '../../Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import StateSelect from '../../StateSelect';
import {Button, TextField} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";

const LocationCreateModal = (props) => {
    const [stateId, setStateId] = useState(1);

    function updateStateSelectValue(e) {
        setStateId(e.target.value)
        console.log(e.target.value)
    }

    const [locationType, setLocationType] = useState("WAREHOUSE");

    function handleLocationTypeChange(e) {
        setLocationType(e.target.value);
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
                locationType: locationType,
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
                    <InputLabel id="state-label">State:</InputLabel>
                        <StateSelect onChangeState={updateStateSelectValue}/>

                    <TextField margin="dense" size="small" fullWidth={true} name="city" variant="outlined" label="City"
                               required/>
                    <TextField margin="dense" size="small" fullWidth={true} name="address1" variant="outlined" label="Address line 1"
                               required/>
                    <TextField margin="dense" size="small" fullWidth={true} name="address2" variant="outlined" label="Address line 2"
                               required/>
                    <InputLabel id="type-label">Type:</InputLabel>
                    <Select
                        variant="outlined"
                        labelId="type-label"
                        id="type"
                        value={locationType}
                        onChange={handleLocationTypeChange}
                    >
                        <MenuItem value={"WAREHOUSE"}>Warehouse</MenuItem>
                        <MenuItem value={"SHOP"}>Shop</MenuItem>
                    </Select>
                    <br />
                    <TextField margin="dense" size="small" fullWidth={true} type="number"
                               InputProps={{ inputProps: { min: 1 } }}
                               name="total_capacity" variant="outlined" label="Total capacity"
                               required/>
                    <TextField margin="dense" size="small" fullWidth={true} type="number"
                               InputProps={{ inputProps: { min: 0, max: 1 } }}
                               name="location_tax" variant="outlined" label="Location tax"
                               required/>
                    <Button fullWidth={false} type="submit" variant="contained">Add location</Button>
                    <Button fullWidth={false} id="closeButton" type="button" onClick={props.onCloseModal}
                            variant="contained">Close</Button>
                </form>
            </div>
        </div>
    )
}


export default LocationCreateModal;