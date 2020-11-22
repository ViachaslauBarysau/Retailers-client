import '../../modals/Modal.css';
import React, {useEffect, useState} from 'react';

import {Button, TextField} from '@material-ui/core';
import ApplicationRecord from "./ApplicationRecord";

const SupplierAppModal = (props) => {
    const [itemRows, setItemRows] = useState({
        items: [],
        totalAmount: 0,
        totalCapacity: 0,
    });

    const [productsData, setData] = useState({
        products: [],
    });

    useEffect(() => {
        fetch('http://localhost:8080/api/products?size=100000', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(products => {
                setData((prevState) => ({
                    ...prevState,
                    products
                }));
            })

    }, []);

    const {products} = productsData;

    const user = JSON.parse(localStorage.getItem("user"));
    const userFullName = user.firstName + " " + user.lastName;
    const locationIdentifier = user.location.identifier;
    const date = new Date().toLocaleString();

    let addRow = (e) => {
        e.preventDefault();
        setItemRows(
            (prevState) => {
                let newItems = prevState.items;
                let newRow = {
                    key: new Date(),
                    upc: "",
                    amount: "",
                    cost: "",
                };
                newItems.push(newRow);
                return ({
                    ...prevState,
                    items: newItems
                })
            }
        );
    };

    const changeRecord = (e, key) => {
        let updatedItems = [];
        if (e.id === "upc") {
            let upc = e.value;
            setItemRows((prevState) => ({
                    ...prevState,
                    items: itemRows.items.map(item => item.key === key ? {...item, upc: upc} : item)
                })
            );
        } else if (e.id === "amount") {
            let amount = e.value;
            setItemRows((prevState) => ({
                    ...prevState,
                    items: itemRows.items.map(item => item.key === key ? {...item, amount: amount} : item)
                })
            );
        } else if (e.id === "cost") {
            let cost = e.value;
            setItemRows((prevState) => ({
                    ...prevState,
                    items: itemRows.items.map(item => item.key === key ? {...item, cost: cost} : item)
                })
            );
        }
    };

    return (
        <div>
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form className="supplier-app-modal">
                        <TextField fullWidth={true} id="app_number" variant="outlined" label="Application number"/>
                        <TextField fullWidth={true} id="supplier" variant="outlined" label="Supplier"/>
                        <TextField fullWidth={true} id="locationId" variant="outlined" label="Destination location"
                                   value={locationIdentifier} disabled/>
                        <TextField fullWidth={true} id="creator" value={userFullName} variant="outlined"
                                   label="Created by" disabled/>
                        <TextField fullWidth={true} id="locationreg_date_timeId" variant="outlined"
                                   label="Registration date and time" disabled/>
                        <TextField fullWidth={true} id="update_date_time" variant="outlined"
                                   label="Updating date and time" disabled/>
                        {console.log("AAA = " + JSON.stringify(itemRows))}
                        {itemRows.items.map((item) => (<ApplicationRecord item={item} products={productsData.products}
                                                                          changeRecord={changeRecord}
                                                                          key={item.key}/>))}
                        <br/>
                        <button onClick={addRow} variant="contained">Add product</button>
                        <br/>
                        <TextField fullWidth={true} id="price" variant="outlined" label="Total amount of products"
                                   disabled/>
                        <TextField fullWidth={true} id="totalItemAmount" variant="outlined"
                                   label="Total volume of products" disabled/>
                        <TextField fullWidth={true} id="totalItemVolume" variant="outlined" label="Total volume"
                                   disabled/>
                        <br/>
                        <Button type="submit" variant="contained">Save application</Button>
                        <Button id="closeButton" onClick={props.onCloseModal} variant="contained">Close</Button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default SupplierAppModal;
