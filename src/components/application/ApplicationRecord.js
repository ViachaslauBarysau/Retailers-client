import '../../modals/upperModals/UpperModal.css';
import React, {useEffect, useRef, useState} from 'react';
import {TextField} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';


export default (props) => {

    function changeRecord(e) {
        props.changeRecord(e.target, props.item.key, props.products.filter((item) => (item.upc === e.target.upc)) )
    }

    return (
        <div>
            <Autocomplete
                size="small"
                clearOnEscape
                options={props.products.map((option) => option.upc.toString())}
                renderInput={(params) => (
                    <TextField {...params} fullWidth={false} label="UPC" margin="normal" variant="outlined" name="upc"
                               value={props.item.upc} error={props.item.error} onFo onChange={changeRecord} required/>
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