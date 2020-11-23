import '../../modals/Modal.css';
import React, {useEffect, useState} from 'react';

import {Button, TextField} from '@material-ui/core';
import ApplicationRecord from "./ApplicationRecord";
import {makeStyles} from "@material-ui/core/styles";
import style from './SupplierAppModal.modules.css'
import Grid from "@material-ui/core/Grid";

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
                    key: new Date().getMilliseconds(),
                    upc: "",
                    amount: "",
                    cost: "",
                    error : true
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
        if (e.name === "upc") {
            let upc = e.value;
            setItemRows((prevState) => ({
                    ...prevState,
                    items: itemRows.items.map(item => item.key === key ? {...item, upc: upc} : item)
                })
            );
        } else if (e.name === "amount") {
            let amount = e.value;
            setItemRows((prevState) => ({
                    ...prevState,
                    items: itemRows.items.map(item => item.key === key ? {...item, amount: amount} : item)
                })
            );
        } else if (e.name === "cost") {
            let cost = e.value;
            setItemRows((prevState) => ({
                    ...prevState,
                    items: itemRows.items.map(item => item.key === key ? {...item, cost: cost} : item)
                })
            );
        } else if (e.name === "delete") {
            setItemRows((prevState) => ({
                    ...prevState,
                    items: prevState.items.filter((item) => (item.key !== key))
                })
            );
        }
    };


    return (
        <div>
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form>
                        <TextField size="small" fullWidth={true} id="app_number"
                                   variant="outlined" label="Application number"/>
                        <TextField size="small" fullWidth={true} id="supplier"
                                   variant="outlined" label="Supplier"/>
                        <TextField size="small" fullWidth={true} id="locationId"
                                   variant="outlined" label="Destination location"
                                   value={locationIdentifier} disabled/>
                        <TextField size="small" fullWidth={true} id="creator" value={userFullName} variant="outlined"
                                   label="Created by" disabled/>
                        <TextField size="small" fullWidth={true} id="locationreg_date_timeId" variant="outlined"
                                   label="Registration date and time" disabled/>
                        <TextField size="small" fullWidth={true} id="update_date_time" variant="outlined"
                                   label="Updating date and time" disabled/>

                        <div className="scrollable-box">
                            <Grid container spacing={1}>
                                <Grid item xm={3}>
                                    {itemRows.items.map((item) => (
                                        <ApplicationRecord item={item} products={productsData.products}
                                                           changeRecord={changeRecord}
                                                           key={item.key}/>))}
                                </Grid>
                            </Grid>
                        </div>

                        <br/>
                        <button onClick={addRow} variant="contained">Add product</button>
                        <br/>
                        <TextField size="small" fullWidth={true} id="price" variant="outlined"
                                   label="Total amount of products"
                                   disabled/>
                        <TextField size="small" fullWidth={true} id="totalItemAmount" variant="outlined"
                                   label="Total volume of products" disabled/>
                        <TextField size="small" fullWidth={true} id="totalItemVolume" variant="outlined"
                                   label="Total volume"
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
