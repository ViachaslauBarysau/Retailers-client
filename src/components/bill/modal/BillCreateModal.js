import '../../Modal.css';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../Button';
import Grid from "@material-ui/core/Grid";
import EditableBillRecord from "./record/EditableBillRecord";

import {AuthContext} from "../../../context/authContext";
import {validateItems} from "../../../validation/ItemRecordValidator";
import {validateBillCreating} from "../../../validation/BillValidator";

const BillCreateModal = (props) => {
    const {user, logout} = useContext(AuthContext);
    const [itemRows, setItemRows] = useState({
        items: [{
            key: new Date().getTime(),
            upc: 0,
            max: 0,
            amount: 0,
            price: 0,
            upcError: false,
            amountError: false
        }]
    });

    const [validationResults, setValidationResults] = useState([]);
    const [locationProducts, setLocationProducts] = useState([]);

    useEffect(() => {
        fetch('/api/location_products?size=100000', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .then(locationProducts => {
                setLocationProducts(locationProducts.content)
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            })
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
                    upcError: false,
                    amountError: false
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
                let itemPrice = 0;
                let max = 0;
                let itemCost = 0;
                if (billProduct) {
                    itemPrice = (1 + billProduct.location.address.state.stateTax
                        + billProduct.product.category.categoryTax + billProduct.location.locationTax) * billProduct.cost;
                    max = billProduct.amount;
                    itemCost = billProduct.cost;
                }
                setItemRows((prevState) => ({
                        ...prevState,
                        items: itemRows.items.map(item => item.key === key ?
                            {
                                ...item,
                                upc: e.value,
                                price: itemPrice.toFixed(2) / 1,
                                max,
                                cost: itemCost
                            } : item)
                    })
                );
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

    function calculateCost() {
        let totalCost = 0;
        itemRows.items.forEach((item) => totalCost += item.cost * item.amount);
        return totalCost;
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
                product: locationProducts.filter((locationProducts) => (locationProducts.product.upc
                    === Number(item.upc)))[0].product,
                productAmount: item.amount,
                productPrice: item.price
            }
        ));
        return recordsList;
    }

    let dateTime = useMemo(() => new Date(), [])

    const createBill = (e) => {
        e.preventDefault(e);
        let validatedItems = validateItems(itemRows.items);
        let validResults = validateBillCreating(e);
        if (validatedItems.filter(item => item.upcError === true).length === 0 &&
            validatedItems.filter(item => item.amountError === true).length === 0 &&
            validResults.length === 0) {
            fetch('/api/bills', {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    billNumber: Number(e.target.billNumber.value),
                    customer: user.customer,
                    location: user.location,
                    shopManager: user,
                    registrationDateTime: dateTime,
                    recordList: getRecordsList(),
                    totalProductAmount: calculateAmount(),
                    totalPrice: calculatePrice(),
                    totalCost: calculateCost()
                }),
                method: "POST"
            })
                .then(res => {
                    switch (res.status) {
                        case 201:
                            props.handleOpenSnackBar("Act created!", "success");
                            props.onCloseModal();
                            props.needrefresh();
                            break;
                        case 401:
                            logout();
                            break;
                        case 451:
                            props.handleOpenSnackBar("Bill number should be unique.", "warning");
                            break;
                    }
                })
                .catch(e => {
                    props.handleOpenSnackBar("Error happens.", "error");
                });
        }
        setItemRows({
            items: validatedItems
        });
        setValidationResults(validResults);
    }

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal}
                 className={"modal-backdrop"}/>
            <div className={"modal-box"}>
                <form onSubmit={createBill}>
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               id="billNumber"
                               variant="outlined"
                               label="Bill number"
                               error={validationResults.includes("billNumber")}
                               helperText={validationResults.includes("billNumber") ?
                                   "Bill number must be between 1 and 999999999." : ""}
                    />
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               id="locationId"
                               variant="outlined"
                               value={user.location.identifier}
                               label="Location identifier"
                               disabled/>
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               id="managerInformation"
                               variant="outlined"
                               label="Manager information"
                               value={`${user.firstName} ${user.lastName}`}
                               disabled/>
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               variant="outlined"
                               label="Registration date and time"
                               value={dateTime}
                               disabled/>
                    <div className="scrollable-box">
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                {itemRows.items.map((item) => (
                                    <EditableBillRecord item={item}
                                                        products={locationProducts}
                                                        changeRecord={changeRecord}
                                                        key={item.key}/>))}
                            </Grid>
                        </Grid>
                    </div>
                    <Button my={1} onClick={addRow}
                            variant="contained">Add product</Button>
                    <br/>
                    <Button my={1} type="submit"
                            variant="contained">Add bill</Button>
                    <Button m={1} id="closeButton"
                            onClick={props.onCloseModal} variant="contained">Close</Button>
                </form>
            </div>
        </div>
    )
}

export default BillCreateModal;
