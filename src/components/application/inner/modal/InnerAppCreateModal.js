import '../../../Modal.css';
import React, {useContext, useEffect, useMemo, useState} from 'react';

import {Button, TextField} from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {AuthContext} from "../../../../context/authContext";
import EditableApplicationRecord from "./record/EditableApplicationRecord";


const InnerAppCreateModal = (props) => {
    const {user} = useContext(AuthContext);
    const [itemRows, setItemRows] = useState({
        items: [{
            key: new Date().getTime(),
            upc: 0,
            max: 0,
            amount: 0,
            cost: 0,
            error: false
        }]
    });
    const [locationProducts, setLocationProducts] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetch('/api/location_products?size=100000', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(locationProducts => {
                setLocationProducts(locationProducts.content)
            });
        fetch('/api/locations/shops', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(locations => {
                setLocations(locations)
            });
    }, []);

    const addRow = (e) => {
        e.preventDefault();
        setItemRows((prevState) => {
                let newItems = prevState.items;
                let newRow = {
                    key: new Date().getTime(),
                    upc: 0,
                    max: 0,
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
                let appProduct = locationProducts.filter(locationProduct => locationProduct.product.upc === Number(e.value))[0];
                let cost = 0;
                let max = 0;
                if (e.value) {
                    cost = appProduct.cost;
                    max = appProduct.amount;
                }
                setItemRows((prevState) => ({
                        ...prevState,
                        items: itemRows.items.map(item => item.key === key ? {
                            ...item,
                            upc: e.value,
                            cost: cost.toFixed(3) / 1,
                            max
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
            case "cost":
                setItemRows((prevState) => ({
                        ...prevState,
                        items: itemRows.items.map(item => item.key === key ? {...item, cost: e.value} : item)
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

    const calculateVolume = () => {
        let totalVolume = 0;
        itemRows.items.forEach((item) => {
                totalVolume += locationProducts.filter((locationProduct) => (locationProduct.product.upc
                    === Number(item.upc)))[0].product.volume * item.amount
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
                product: locationProducts.filter((locationProducts) => (locationProducts.product.upc
                        === Number(item.upc)))[0].product,
                amount: item.amount,
                cost: item.cost
            }
        ));
        return recordsList;
    }

    let dateTime = useMemo(() => new Date(), [])

    const createApplication = (e) => {
        e.preventDefault(e);
        console.log(e.target.location.value)
        fetch('/api/inner_applications', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                applicationNumber: Number(e.target.appNumber.value),
                sourceLocation: user.location,
                destinationLocation: locations.filter(location => location.identifier === e.target.location.value)[0],
                creator: user,
                updater: user,
                registrationDateTime: dateTime,
                updatingDateTime: dateTime,
                applicationStatus: "OPEN",
                recordsList: getRecordsList(),
                totalProductAmount: calculateAmount(),
                totalUnitNumber: calculateVolume()
            }),
            method: "POST"
        });
        props.onCloseModal();
    }

    return (
        <div>
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={createApplication}>
                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   id="appNumber"
                                   variant="outlined"
                                   label="Application number"
                                   required/>

                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   id="locationId"
                                   variant="outlined"
                                   value={user.location.identifier}
                                   label="Source location"
                                   disabled/>
                        <Autocomplete
                            id="location"
                            size="small"
                            name="location"
                            clearOnEscape
                            options={locations.map((option) => option.identifier.toString())}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth={true} label="Destination location" margin="dense"
                                           variant="outlined" required/>
                            )}
                        />

                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   id="creator"
                                   variant="outlined"
                                   label="Created by"
                                   value={`${user.firstName} ${user.lastName}`}
                                   disabled/>
                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   id="locationreg_date_timeId"
                                   variant="outlined"
                                   label="Registration date and time"
                                   value={dateTime}
                                   disabled/>

                        <div className="scrollable-box">
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    {itemRows.items.map((item) => (
                                        <EditableApplicationRecord item={item}
                                                                   products={locationProducts}
                                                                   changeRecord={changeRecord}
                                                                   key={item.key}/>))}
                                </Grid>
                            </Grid>
                        </div>
                        <br/>
                        <Button onClick={addRow}
                                variant="contained">Add product</Button>
                        <br/>
                        <br/>
                        <Button type="submit"
                                variant="contained">Save application</Button>
                        <Button id="closeButton"
                                onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default InnerAppCreateModal;
