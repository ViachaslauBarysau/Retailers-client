import React from 'react';
import {TextField} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";


export default (props) => {

    function changeRecord(e) {
        props.changeRecord(e.target, props.item.key, props.products.filter((item) => (item.upc === e.target.upc)))
    }

    function handleChangeUPC(e, value) {
        let state = {
            target: {name: "upc", value}
        };
        changeRecord(state);
    }


    function handleChange(e) {
        console.log(e.target.name)
    }

    return (
        <Grid container>
            <Grid item xs={4}>
                <Autocomplete
                    size="small"
                    componentName="upc"
                    onChange={(e) => handleChangeUPC(e, e.target.innerText)}
                    clearOnEscape
                    options={props.products.map((option) => option.product.upc.toString())}
                    renderInput={(params) => (
                        <TextField {...params} fullWidth={true} label="UPC" margin="normal" variant="outlined"
                                   value={props.item.upc} error={props.item.error} required/>
                    )}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField margin="normal" type="number" size="small" required name="amount" variant="outlined"
                           label="Amount" value={props.item.amount} onChange={changeRecord}/>
            </Grid>
            <Grid item xs={4}>
                <InputLabel id="reason-label">Reason:</InputLabel>
                <Select
                    labelId="reason-label"
                    id="reason"
                    name="reason"
                    fullWidth={true}
                    variant="outlined"
                    size="small"
                    required
                    value={props.item.reason}
                    onChange={changeRecord}
                >
                    <MenuItem value={"DAMAGED"}>Damaged</MenuItem>
                    <MenuItem value={"SPOILED"}>Spoiled</MenuItem>
                    <MenuItem value={"LOST"}>Lost</MenuItem>
                    <MenuItem value={"STOLEN"}>Stolen</MenuItem>
                </Select>

                {/*<TextField margin="normal" type="number" size="small" required name="cost" variant="outlined"*/}
                {/*           label="Cost"  onChange={changeRecord}/>*/}
            </Grid>
            <Grid item xs={1}>
                <IconButton aria-label="delete" onClick={changeRecord}>
                    <DeleteIcon fontSize="large"/>
                </IconButton>
            </Grid>
        </Grid>
    )
}