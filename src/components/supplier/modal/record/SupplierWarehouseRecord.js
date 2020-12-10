import React from 'react';
import {Button, TextField} from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";


export default (props) => {

    function changeRecord(e) {

    }

    function handleChangeUPC(e, value) {
        // let state = {
        //     target: {name: "upc", value}
        // };
        // changeRecord(state);
    }

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
            <div className={"modal-box"}>
                <form>
                    <TextField margin="dense" fullWidth={true} size="small" name="name" variant="outlined"
                               label="Full name"  required/>
                    <TextField margin="dense" type="number" size="small" name="state" variant="outlined"
                               label="State" required/>
                    <TextField margin="dense" type="number" size="small" name="city" variant="outlined"
                               label="City" fullWidth={true} required/>
                    <TextField margin="dense" type="number" size="small" name="address1" variant="outlined"
                               label="Address line 1" fullWidth={true} required/>
                    <TextField margin="dense" fullWidth={true} type="number" size="small" name="address2" variant="outlined"
                               label="Address line 2" required/>
                    {/*<Button  variant="contained" onClick={() => setDisplayRecordModal(true)}>Add warehouse</Button>*/}
                    {/*<Button type="submit" variant="contained">Add supplier</Button>*/}
                    <Button id="closeButton" onClick={props.onCloseModal} variant="contained">Close</Button>
                </form>
            </div>
        </div>
        // <Grid container>
        //     <Grid item xs={12}>
        //         <TextField margin="dense" fullWidth={true} size="small" name="name" variant="outlined"
        //                    label="Full name"  required/>
        //     </Grid>
        //     <Grid item xs={5}>
        //         <TextField margin="dense" type="number" size="small" name="state" variant="outlined"
        //                    label="State" required/>
        //     </Grid>
        //     <Grid item xs={7}>
        //         <TextField margin="dense" type="number" size="small" name="city" variant="outlined"
        //                    label="City" fullWidth={true} required/>
        //     </Grid>
        //     <Grid item xs={12}>
        //         <TextField margin="dense" type="number" size="small" name="address1" variant="outlined"
        //                    label="Address line 1" fullWidth={true} required/>
        //     </Grid>
        //     <Grid item xs={11}>
        //         <TextField margin="dense" fullWidth={true} type="number" size="small" name="address2" variant="outlined"
        //                    label="Address line 2" required/>
        //     </Grid>
        //     <Grid item xs={1}>
        //         <IconButton aria-label="delete" onClick={changeRecord}>
        //             <DeleteIcon fontSize="large"/>
        //         </IconButton>
        //     </Grid>
        // </Grid>
    )
}