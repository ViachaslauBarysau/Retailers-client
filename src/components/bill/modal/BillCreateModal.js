import '../../Modal.css';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import EditableBillRecord from "./record/EditableBillRecord";

import {AuthContext} from "../../../context/authContext";

const BillCreateModal = (props) => {
    const {user} = useContext(AuthContext);
    const [itemRows, setItemRows] = useState({
        items: [{
            key: new Date().getTime(),
            upc: 0,
            amount: 0,
            price: 0,
            error: false
        }]
    });
    // const [totalPrice, setTotalPrice] = useState(0);
    const [locationProducts, setLocationProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/location_products?size=100000', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(locationProducts => {
                setLocationProducts(locationProducts)
            });
    }, []);

    const addRow = (e) => {
        e.preventDefault();
        setItemRows((prevState) => {
                let newItems = prevState.items;
                let newRow = {
                    key: new Date().getTime(),
                    upc: 0,
                    amount: 0,
                    price: 0,
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

    const changeRecord = (e, key) => {
        switch (e.name) {
            case "upc":
                let billProduct = locationProducts.filter(prod => prod.product.upc === Number(e.value))[0];
                if (billProduct) {
                    let itemPrice = (1 + billProduct.location.address.state.stateTax
                        + billProduct.product.category.categoryTax + billProduct.location.locationTax) * billProduct.cost;
                    setItemRows((prevState) => ({
                            ...prevState,
                            items: itemRows.items.map(item => item.key === key ?
                                {
                                    ...item,
                                    upc: e.value,
                                    price: itemPrice
                                } : item)
                        })
                    );
                }
                break;
            case "amount":
                setItemRows((prevState) => ({
                        ...prevState,
                        items: itemRows.items.map(item => item.key === key ? {...item, amount: e.value} : item)
                    })
                );
                break;
            default:
                if (itemRows.items.length > 1) {
                    setItemRows((prevState) => ({
                            ...prevState,
                            items: prevState.items.filter((item) => (item.key !== key))
                        })
                    );
                }
                break;
        }
    };

    const calculatePrice = () => {
        let totalPrice = 0;
        itemRows.items.forEach((item) => totalPrice += item.price * item.amount);
        console.log(totalPrice)
        return totalPrice;
    }

    const calculateAmount = () => {
        let totalAmount = 0;
        itemRows.items.forEach((item) => {
                totalAmount += Number(item.amount);
            }
        );
        return totalAmount;
    }

    const getRecordsList = () => {
        let recordsList = itemRows.items.map((item) => (
            {
                product: {
                    id: locationProducts.filter((locationProducts) => (locationProducts.product.upc
                        === Number(item.upc)))[0].product.id
                },
                productAmount: item.amount,
                productPrice: item.price
            }
        ));
        return recordsList;
    }

    let dateTime = useMemo(() => new Date(), [])

    const createBill = (e) => {
        e.preventDefault(e);

        fetch('http://localhost:8080/api/bills', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                billNumber: Number(e.target.billNumber.value),
                location: user.location,
                shopManager: {
                    id: user.id
                },
                registrationDateTime: dateTime,
                recordList: getRecordsList(),
                totalProductAmount: calculateAmount(),
                totalPrice: calculatePrice()
            }),
            method: "POST"
        });
        props.onCloseModal();
    }

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
            <div className={"modal-box"}>
                <form onSubmit={createBill}>
                    <TextField margin="dense" size="small" fullWidth={true} id="billNumber"
                               variant="outlined" label="Bill number" required/>
                    <TextField margin="dense" size="small" fullWidth={true} id="locationId"
                               variant="outlined" value={user.location.identifier} label="Location identifier"
                               disabled/>
                    <TextField margin="dense" size="small" fullWidth={true} id="managerInformation" variant="outlined"
                               label="Manager information" value={`${user.firstName} ${user.lastName}`} disabled/>
                    <TextField margin="dense" size="small" fullWidth={true} variant="outlined"
                               label="Registration date and time" value={dateTime} disabled/>
                    <div className="scrollable-box">
                        <Grid container spacing={1}>
                            <Grid item xm={12}>
                                {itemRows.items.map((item) => (
                                    <EditableBillRecord item={item}
                                                        products={locationProducts}
                                                        changeRecord={changeRecord}
                                                        key={item.key}/>))}
                            </Grid>
                        </Grid>
                    </div>
                    <br/>
                    <Button onClick={addRow} variant="contained">Add product</Button>
                    <br/>
                    <br/>
                    <Button type="submit" variant="contained">Add bill</Button>
                    <Button id="closeButton" onClick={props.onCloseModal} variant="contained">Close</Button>
                </form>
            </div>
        </div>
    )
}

export default BillCreateModal;
