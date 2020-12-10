import '../../Modal.css';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../Button';
import Grid from "@material-ui/core/Grid";
import SupplierWarehouseRecord from "./record/SupplierWarehouseRecord";

import {AuthContext} from "../../../context/authContext";

const SupplierCreateModal = (props) => {
    const [warehouseRows, setWarehouseRows] = useState({
        warehouses: [{
            key: new Date().getTime(),
            name: "",
            state: "",
            city: "",
            address1: "",
            address2: ""
        }]
    });

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
            <div className={"modal-box"}>
                <form>
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               id="billNumber"
                               variant="outlined"
                               label="Full name"
                               required/>
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               id="locationId"
                               variant="outlined"
                               label="Identifier"
                               disabled/>
                    <div className="scrollable-box">
                        <Grid container spacing={1}>
                            <Grid item xm={12}>
                                {/*{warehouseRows.warehouses.map((warehouse) => (*/}
                                {/*    <SupplierWarehouseRecord warehouse={warehouse}*/}
                                {/*                        key={warehouse.key}/>))}*/}
                            </Grid>
                        </Grid>
                    </div>
                    <Button my={1} variant="contained">Add warehouse</Button>
                    <br/>
                    <Button my={1} type="submit"
                            variant="contained">Add supplier</Button>
                    <Button m={1} id="closeButton"
                            onClick={props.onCloseModal}
                            variant="contained">Close</Button>
                </form>
            </div>

        </div>
    )
}

export default SupplierCreateModal;
