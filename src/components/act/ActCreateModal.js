import '../../modals/Modal.css';
import ReactDom from 'react-dom';
import React, {useState, useEffect, useContext, useMemo} from 'react';
import {Button, TextField} from "@material-ui/core";
import {AuthContext} from "../../context/authContext";
import Grid from "@material-ui/core/Grid";
import EditableApplicationRecord from "../application/inner/modal/record/EditableApplicationRecord";
import EditableActRecord from "./EditableActRecord";

const ActCreateModal = (props) => {

    const [itemRows, setItemRows] = useState({
        items: []
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
                setItemRows((prevState) => ({
                        ...prevState,
                        items: prevState.items.filter((item) => (item.key !== key))
                    })
                );
                break;
        }
    };

    let dateTime = useMemo(() => new Date(), [])

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form>
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
                    <TextField margin="dense" name="sum" size="small" fullWidth={true}
                               variant="outlined" label="Total sum of items"
                               required/>
                    <Button fullWidth={false} type="submit" variant="contained">Add act</Button>
                    <Button fullWidth={false} id="closeButton" type="button" onClick={props.onCloseModal}
                            variant="contained">Close</Button>
                </form>
            </div>
        </div>
    )
}

export default ActCreateModal;
