import '../../modals/Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import UpperProductModal from '../../modals/upperModals/UpperProductModal';
import { Button, Form } from 'react-bootstrap';

const BillModal = (props) => {
    let user = JSON.parse(localStorage.getItem("user"));
    let userFullName = user.firstName + " " + user.lastName;
    let locationIdentifier = user.location.identifier;
    let date = new Date().toLocaleString();
    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form>
                    <label> Bill number:
              <input type="text" id="billNumber" />
                    </label>
                    <br />
                    <label> Location identifier:
              <input type="text" id="locationId" value={locationIdentifier} disabled/>
                    </label>
                    <br />
                    <label> Manager information:
              <input type="text" id="managerInformation" value={userFullName} disabled/>
                    </label>
                    <br />
                    <label> Registration date and time:
              <input type="text" id="reg_date_time" value={date} disabled/>
                    </label>
                    <br />
                    <br />
                    <table border="1" width="400px">
                        <tr>
                            <th>Item</th>
                            <th>Count</th>
                        </tr>
                    </table>
                    <Button onClick={props.onOpenUpperModal}>
                        Add product
                    </Button>
                    <br />
                    <br />
                    <label> Price:
              <input type="text" id="price" disabled/>
                    </label>
                    <br />
                    <label> Total amount of items:
              <input type="text" id="totalItemAmount" disabled/>
                    </label>
                    <br />
                    <label> Total volume:
              <input type="text" id="totalItemVolume" disabled/>
                    </label>
                    <br />
                    <input type="submit" value="Add bill" />
                    <input type="button" onClick={props.onCloseModal} value="Close" />
                </form>
            </div>
        </div>
    )
}

export default BillModal;
