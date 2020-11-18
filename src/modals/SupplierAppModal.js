import './Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import UpperProductModal from './upperModals/UpperProductModal';
import { Button, Form } from 'react-bootstrap';

const SupplierAppModal = (props) => {
    let user = JSON.parse(localStorage.getItem("user"));
    let userFullName = user.firstName + " " + user.lastName;
    let locationIdentifier = user.location.identifier;
    let date = new Date().toLocaleString();
    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form>
                    <label> Application number:
              <input type="text" id="app_number" />
                    </label>
                    <br />
                    <label> Supplier:
              <input type="text" id="supplier" disabled/>
                    </label>
                    <br />
                    <label> Destination location:
              <input type="text" id="locationId" value={locationIdentifier} disabled/>
                    </label>
                    <br />
                    <label> Created by:
              <input type="text" id="creator" value={userFullName} disabled/>
                    </label>
                    <br />
                    <label> Registration date and time:
              <input type="text" id="reg_date_time" value={date} disabled/>
                    </label>
                    <br />
                    <label> Updating date and time:
              <input type="text" id="update_date_time" value={date} disabled/>
                    </label>
                    <br />
                    <br />
                    <table border="1" width="400px">
                        <tr>
                            <th>Item UPC</th>
                            <th>Amount</th>
                            <th>Cost</th>
                        </tr>
                    </table>
                    <Button onClick={props.onOpenUpperModal}>
                        Add product
                    </Button>
                    <br />
                    <br />
                    <label> Total amount of products:
              <input type="text" id="price" disabled/>
                    </label>
                    <br />
                    <label> Total volume of products:
              <input type="text" id="totalItemAmount" disabled/>
                    </label>
                    <br />
                    <label> Total volume:
              <input type="text" id="totalItemVolume" disabled/>
                    </label>
                    <br />
                    <input type="submit" value="Save application" />
                    <input type="button" onClick={props.onCloseModal} value="Close" />
                </form>
            </div>
        </div>
    )
}

export default SupplierAppModal;
