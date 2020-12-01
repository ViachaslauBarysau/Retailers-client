import '../../Modal.css';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Button, TextField} from "@material-ui/core";
import {AuthContext} from "../../../context/authContext";
import Grid from "@material-ui/core/Grid";
import EditableActRecord from "./record/EditableActRecord";

const ActCreateModal = (props) => {
    const {user} = useContext(AuthContext);
    const [itemRows, setItemRows] = useState({
        items: [{
            key: new Date().getTime(),
            upc: 0,
            amount: 0,
            reason: "",
            error: false
        }]
    });
    const [locationProducts, setLocationProducts] = useState(null);

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
                    reason: "",
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
            case "reason":
                setItemRows((prevState) => ({
                        ...prevState,
                        items: itemRows.items.map(item => item.key === key ? {...item, reason: e.value} : item)
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

    const calculateCost = () => {
        let totalCost = 0;
        itemRows.items.forEach((item) => totalCost += locationProducts.filter((locationProducts) =>
            (locationProducts.product.upc === Number(item.upc)))[0].cost * item.amount);
        console.log(totalCost)
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
                product: locationProducts.filter((locationProduct) => (locationProduct.product.upc
                        === Number(item.upc)))[0].product,
                amount: item.amount,
                reason: item.reason
            }
        ));
        return recordsList;
    }
    console.log(itemRows.items)
    let dateTime = useMemo(() => new Date(), [])

    const createAct = (e) => {
        e.preventDefault(e);
        fetch('http://localhost:8080/api/write_off_acts', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                writeOffActNumber: Number(e.target.actNumber.value),
                location: user.location,
                actDateTime: dateTime,
                writeOffActRecords: getRecordsList(),
                totalProductAmount: calculateAmount(),
                totalProductSum: calculateCost()
            }),
            method: "POST"
        });
        props.onCloseModal();
    }

    return (
        <div>
            {locationProducts &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={createAct}>
                        <TextField margin="dense" name="actNumber" size="small" fullWidth={true}
                                   variant="outlined" label="Write-off act number"
                                   required/>
                        <div className="scrollable-box">
                            <Grid container spacing={1}>
                                <Grid item xm={12}>
                                    {itemRows.items.map((item) => (
                                        <EditableActRecord item={item}
                                                           products={locationProducts}
                                                           changeRecord={changeRecord}
                                                           key={item.key}/>))}
                                </Grid>
                            </Grid>
                        </div>
                        <Button onClick={addRow} variant="contained">Add product</Button>
                        <TextField value={dateTime} margin="dense" name="date" size="small" fullWidth={true}
                                   variant="outlined" label="Date and time"
                                   disabled/>
                        <Button fullWidth={false} type="submit" variant="contained">Add act</Button>
                        <Button fullWidth={false} id="closeButton" type="button" onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>  }
        </div>

    )
}

export default ActCreateModal;
