import React, {useContext} from 'react';
import {TextField} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {AuthContext} from "../../../../context/authContext";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";


export default (props) => {
    const {user} = useContext(AuthContext);

    function changeRecord(e) {
        props.changeRecord(e.target, props.item.key, props.products.filter((item) => (item.upc === e.target.upc)))
    }

    function handleChangeUPC(e, value) {
        let state = {
            target: {name: "upc", value}
        };
        changeRecord(state);
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
                        <TextField {...params}
                                   fullWidth={true}
                                   label="UPC"
                                   margin="normal"
                                   variant="outlined"
                                   value={props.item.upc}
                                   error={props.item.upcError}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField margin="normal"
                           type="number"
                           size="small"
                           name="amount"
                           fullWidth={true}
                           variant="outlined"
                           label="Amount"
                           InputProps={{
                               inputProps: {
                                   step: 1
                               }
                           }}
                           value={props.item.amount}
                           onChange={changeRecord}
                           error={props.item.amountError}
                           helperText={props.item.upc ? "Available: " + props.item.max : "Product not chosen."}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField margin="normal"
                           type="number"
                           size="small"
                           name="price"
                           fullWidth={true}
                           variant="outlined"
                           label="Price"
                           value={props.item.price}
                           disabled/>
            </Grid>
            <Grid item xs={1}>
                <IconButton aria-label="delete"
                            onClick={changeRecord}>
                    <DeleteIcon fontSize="large"/>
                </IconButton>
            </Grid>
        </Grid>
    )
}