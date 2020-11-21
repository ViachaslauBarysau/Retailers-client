import '../../modals/upperModals/UpperModal.css';
import React, {useEffect, useState} from 'react';
import {TextField} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';


export default (props) => {

    function changeRecord(e) {
        props.changeRecord(e.target, props.item.key)
    }

    return (
        <div>
            <Autocomplete
                id="upc"
                freeSolo
                autoSelect
                options={props.products.map((option) => option.upc.toString())}
                renderInput={(params) => (
                    <TextField {...params} fullWidth={false} label="UPC" margin="normal" variant="outlined"
                               value={props.item.upc} onChange={changeRecord}/>
                )}
            />
            <TextField id="amount" variant="outlined" label="Amount" value={props.item.amount} onChange={changeRecord}/>
            <TextField id="cost" variant="outlined" label="Cost" value={props.item.cost} onChange={changeRecord}/>
        </div>
    )
}