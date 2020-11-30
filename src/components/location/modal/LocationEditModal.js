import '../../Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import StateSelect from '../../StateSelect';
import {Button, TextField} from "@material-ui/core";

const LocationEditModal = (props) => {
    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form >
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
                    <Button variant="contained" onClick={props.onCloseModal}>
                        Close
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default LocationEditModal;