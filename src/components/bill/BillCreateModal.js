import '../../modals/Modal.css';
import ReactDom from 'react-dom';
import React, {useState, useEffect, useContext, useMemo} from 'react';
import {Button, TextField} from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import EditableBillRecord from "./EditableBillRecord";

import {AuthContext} from "../../context/authContext";

const BillCreateModal = (props) => {
    const {user} = useContext(AuthContext);
    const [itemRows, setItemRows] = useState({
        items: []
    });
    const [locationProducts, setLocationProducts] = useState([]);
    const [locations, setLocations] = useState([]);

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

    const changeRecord = (e, key) => {
        switch (e.name) {
            case "upc":
                setItemRows((prevState) => ({
                        ...prevState,
                        items: itemRows.items.map(item => item.key === key ? {...item, upc: e.value} : item)
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
            case "cost":
                setItemRows((prevState) => ({
                        ...prevState,
                        items: itemRows.items.map(item => item.key === key ? {...item, cost: e.value} : item)
                    })
                );
                break;
            case "delete":
                setItemRows((prevState) => ({
                        ...prevState,
                        items: prevState.items.filter((item) => (item.key !== key))
                    })
                );
                break;
        }
    };

    const calculateVolume = () => {
        let totalVolume = 0;
        itemRows.items.forEach((item) => {
                totalVolume += locationProducts.filter((locationProduct) => (locationProduct.product.upc
                    === Number(item.upc)))[0].volume * item.amount
            }
        );
        return totalVolume;
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
                amount: item.amount,
                cost: item.cost
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
                location: {
                    id: user.location.id
                },
                creator: {
                    id: user.id
                },
                registrationDateTime: dateTime,
                recordsList: getRecordsList(),
                totalProductAmount: calculateAmount(),
                totalUnitNumber: calculateVolume()
            }),
            method: "POST"
        });
        e.target.closeButton.click();
    }

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form onSubmit={createBill}>
                    <TextField size="small" fullWidth={true} id="billNumber"
                               variant="outlined" label="Bill number" required/>
                    <TextField size="small" fullWidth={true} id="locationId"
                               variant="outlined" value={user.location.identifier} label="Location identifier"
                               disabled/>
                    <TextField size="small" fullWidth={true} id="managerInformation" variant="outlined"
                               label="Manager information" value={`${user.firstName} ${user.lastName}`} disabled/>
                    <TextField size="small" fullWidth={true} variant="outlined"
                               label="Registration date and time" value={dateTime}  disabled/>
                    <div className="scrollable-box">
                        <Grid container spacing={1}>
                            <Grid item xm={3}>
                                {itemRows.items.map((item) => (
                                    <EditableBillRecord item={item}
                                                               products={locationProducts}
                                                               changeRecord={changeRecord}
                                                               key={item.key}/>))}
                            </Grid>
                        </Grid>
                    </div>
                    <Button onClick={addRow} variant="contained">Add product</Button>
                    <br />
                    <Button type="submit" variant="contained">Add bil</Button>
                    <Button id="closeButton" onClick={props.onCloseModal} variant="contained">Close</Button>
                </form>
            </div>
        </div>
    )
}

export default BillCreateModal;
