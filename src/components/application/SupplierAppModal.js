import '../../modals/Modal.css';
import React, {useContext, useEffect, useState} from 'react';

import {Button, TextField} from '@material-ui/core';
import ApplicationRecord from "./ApplicationRecord";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {AuthContext} from "../../context/authContext";

const SupplierAppModal = (props) => {
    const {user} = useContext(AuthContext);
    const [itemRows, setItemRows] = useState({
        items: [],
        totalAmount: 0,
        totalVolume: 0,
    });
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/products?size=100000', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(products => {
                setProducts(products)
            });
        fetch('http://localhost:8080/api/suppliers?size=100000', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(suppliers => {
                setSuppliers(suppliers)
            });
    }, []);

    const addRow = (e) => {
        e.preventDefault();
        setItemRows((prevState) => {
                let newItems = prevState.items;
                let newRow = {
                    key: new Date().getMilliseconds(),
                    upc: 0,
                    amount: 0,
                    cost: 0,
                    error: false
                };
                newItems.push(newRow);
                return ({
                    ...prevState,
                    items: newItems
                })
            }
        );
    };
    console.log(itemRows.items)
    const changeRecord = (e, key) => {

        if (e.name === "upc") {
            let upc = e.value;
            setItemRows((prevState) => ({
                    ...prevState,
                    items: itemRows.items.map(item => item.key === key ? {...item, upc: upc} : item)
                })
            );
        } else if (e.name === "amount") {
            let amount = e.value;
            console.log(amount)
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

    const calculateVolume = () => {
        let totalVolume = 0;
        console.log(products);
        console.log(itemRows.items);
        itemRows.items.forEach((item) =>  (console.log(products.filter((product) => (product.upc === item.upc)))));
        console.log(products)
    }

    const createApplication = (e) => {
        e.preventDefault(e);

        let supplierId = suppliers.filter(supplier => supplier.identifier === e.target.supplier.value)[0].id;
        let dateTime = new Date();
        let recordsList = [];
        calculateVolume();

        fetch('http://localhost:8080/api/supplier_applications', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                applicationNumber: e.target.app_number.value,
                supplier: {
                    id: supplierId
                },
                destinationLocation: {
                    id: user.location.id
                },
                creator: {
                    id: user.id
                },
                updater: {
                    id: user.id
                },
                registrationDateTime: dateTime,
                updatingDateTime: dateTime,
                applicationStatus: "OPEN",
                recordsList: [
                    {
                        product: {
                            id: 2
                        },
                        amount: 3,
                        cost: 3
                    }
                ],
                totalProductAmount: 10,
                totalUnitNumber: 20
            }),
            method: "POST"
        });
        e.target.closeButton.click();
    }


    return (
        <div>

            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={createApplication}>
                        <TextField size="small" fullWidth={true} id="app_number"
                                   variant="outlined" label="Application number"/>

                        <Autocomplete
                            id="supplier"
                            size="small"
                            name="supplier"
                            clearOnEscape
                            options={suppliers.map((option) => option.identifier.toString())}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth={true} label="Supplier" margin="normal"
                                           variant="outlined"
                                           id="supplier" required/>
                            )}
                        />
                        <TextField size="small" fullWidth={true} id="locationId"
                                   variant="outlined" label="Destination location"
                                   disabled/>
                        <TextField size="small" fullWidth={true} id="creator" variant="outlined"
                                   label="Created by" disabled/>
                        <TextField size="small" fullWidth={true} id="locationreg_date_timeId" variant="outlined"
                                   label="Registration date and time" disabled/>
                        <TextField size="small" fullWidth={true} id="update_date_time" variant="outlined"
                                   label="Updating date and time" disabled/>

                        <div className="scrollable-box">
                            <Grid container spacing={1}>
                                <Grid item xm={3}>
                                    {itemRows.items.map((item) => (
                                        <ApplicationRecord item={item}
                                                           products={products}
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
