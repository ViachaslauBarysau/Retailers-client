import '../../modals/Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import {Button, TextField} from "@material-ui/core";

const ActEditModal = (props) => {
    let [act, setAct] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/write_off_acts/' + props.actId, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(act => {
                setAct(act);
            });
    }, []);

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form>
                    <TextField margin="dense" size="small" name="upc" fullWidth={true} variant="outlined" label="UPC"
                               required/>
                    <TextField margin="dense" name="amount" size="small" fullWidth={true}
                               variant="outlined" label="Amount"
                               required/>
                    <TextField margin="dense" name="reason" size="small" fullWidth={true}
                               variant="outlined" label="Reason"
                               required/>
                    <TextField margin="dense" name="date" size="small" fullWidth={true}
                               variant="outlined" label="Date and time"
                               required/>
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

export default ActEditModal;
