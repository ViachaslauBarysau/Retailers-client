import '../../modals/Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import { getDateStringWithoutTime } from '../../util/DateAndTime';
import {Button, TextField} from "@material-ui/core";


const CustomerCreateModal = (props) => {
    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onClick} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form onSubmit={addCustomer}>
                    <TextField margin="dense" size="small" fullWidth={true} id="name" variant="outlined" label="Name" required/>
                    <TextField type="email" margin="dense" size="small" fullWidth={true}
                               id="email" variant="outlined" label="Email" required/>
                    <Button fullWidth={false} type="submit" variant="contained">Add customer</Button>
                    <Button fullWidth={false} id="closeButton" type="button" onClick={props.onClick} variant="contained">Close</Button>
                </form>
            </div>
        </div>
    )
}

function addCustomer(e) {
    e.preventDefault();
    fetch('http://localhost:8080/api/customers', {
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            customerStatus: "ACTIVE",
            name: e.target.name.value,
            email: e.target.email.value,
            registrationDate: new Date()
        }),
        method: "POST"
    });
    e.target.closeButton.click();
}

export default CustomerCreateModal;
