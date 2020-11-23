import '../../modals/Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import { getDateStringWithoutTime } from '../../util/DateAndTime';


const CustomerModal = (props) => {    
    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onClick} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form onSubmit={addCustomer}>
                    <label> Name:
              <input type="text" id="name" name="name" />
                    </label>
                    <br />
                    <label> Email:
              <input type="email" id="email" name="email" />
                    </label>
                    <br />
                    <input type="submit" value="Add customer" />
                    <input  id="closeButton" type="button" onClick={props.onClick} value="Close" />
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

export default CustomerModal;
