import './Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import UpperProductModal from './upperModals/UpperProductModal';
import { Form } from 'react-bootstrap';
import { TextField, Button } from '@material-ui/core';

const SupplierAppModal = (props) => {
    const [productsData, setData] = useState({
        products: [],
    });

    let user = JSON.parse(localStorage.getItem("user"));
    let userFullName = user.firstName + " " + user.lastName;
    let locationIdentifier = user.location.identifier;
    let date = new Date().toLocaleString();
    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form>
                    <TextField id="app_number" variant="outlined" label="Application number" />
                    <TextField id="supplier" variant="outlined" label="Supplier" />
                    <TextField id="locationId" variant="outlined" label="Destination location" value={locationIdentifier} disabled/>
                    <TextField id="creator" value={userFullName} variant="outlined" label="Created by" disabled />
                    <TextField id="locationreg_date_timeId" value={date} variant="outlined" label="Registration date and time" disabled  />
                    <TextField id="update_date_time" variant="outlined" label="Updating date and time" value={date} disabled />
                    <br />
                    <table border="1" width="400px">
                        <tr>
                            <th>Item UPC</th>
                            <th>Amount</th>
                            <th>Cost</th>
                        </tr>
                    </table>
                    <Button onClick={props.onOpenUpperModal} variant="contained">Add product</Button>
                    <br />
                    <TextField id="price" variant="outlined" label="Total amount of products" disabled />
                    <TextField id="totalItemAmount" variant="outlined" label="Total volume of products" disabled />
                    <TextField id="totalItemVolume" variant="outlined" label="Total volume" disabled />
                    <br/>
                    <Button type="submit" variant="contained">Save application</Button>
                    <Button id="closeButton" onClick={props.onCloseModal} variant="contained">Close</Button>
                </form>
            </div>
        </div>
    )
}

export default SupplierAppModal;
