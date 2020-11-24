import '../../modals/upperModals/UpperModal.css';
import React, {useEffect, useRef, useState} from 'react';
import {TextField, Button} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';


export default (props) => {

    function changeRecord(e) {
        props.changeRecord(e.target, props.item.key, props.products.filter((item) => (item.upc === e.target.upc)) )
    }

    function handleChangeUPC(e, value) {
        let state = {
            target: {name: "upc", value}
        };
        changeRecord(state);
    }

    return (
        <div>
            <Autocomplete
                size="small"
                componentName="upc"
                onChange={(e) => handleChangeUPC(e, e.target.innerText)}
                clearOnEscape
                options={props.products.map((option) => option.upc.toString())}
                renderInput={(params) => (
                    <TextField {...params} fullWidth={false} label="UPC" margin="normal" variant="outlined"
                               value={props.item.upc} error={props.item.error} required/>
                )}
            />
            <TextField type="number" size="small" required name="amount" variant="outlined"
                       label="Amount" value={props.item.amount} onChange={changeRecord}/>
            <TextField type="number" size="small" required name="cost" variant="outlined"
                       label="Cost" value={props.item.cost} onChange={changeRecord}/>
            <button name="delete" onClick={changeRecord}>DELETE RECORD</button>
        </div>
    )
}