import '../../modals/Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {Button, TextField} from '@material-ui/core';

import {AuthContext} from "../../context/authContext";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

const BillCreateModal = (props) => {
    const {user} = useContext(AuthContext);
    const [bill, setIBill] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/bills/' + props.billId, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(bill => {
                setIBill(bill)
            });
    }, []);


    console.log(props.billId)
    return (
        <div>
            {bill &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form>
                        <TextField margin="dense" size="small" fullWidth={true}
                                   variant="outlined" label="Bill number" value={bill.billNumber} disabled/>
                        <TextField margin="dense" size="small" fullWidth={true}
                                   variant="outlined" value={user.location.identifier} label="Location identifier"
                                   disabled/>
                        <TextField margin="dense" size="small" fullWidth={true}
                                   variant="outlined"
                                   label="Manager information"
                                   value={`${bill.shopManager.firstName} ${bill.shopManager.lastName}`} disabled/>
                        <TextField margin="dense" size="small" fullWidth={true} variant="outlined"
                                   label="Registration date and time" value={bill.registrationDateTime}disabled/>
                        <div className="scrollable-box">
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>UPC</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                            <TableCell align="right">Cost</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bill.recordList.map((record) => (
                                            <TableRow key={record.product.upc}>
                                                <TableCell component="th" scope="row">
                                                    {record.product.upc}
                                                </TableCell>
                                                <TableCell align="right">{record.productAmount}</TableCell>
                                                <TableCell align="right">{record.productPrice}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <TextField margin="dense" size="small" fullWidth={true}
                                   variant="outlined" label="Total product amount" value={bill.totalProductAmount} disabled/>
                        <TextField margin="dense" size="small" fullWidth={true}
                                   variant="outlined" value={bill.totalPrice} label="Total price"
                                   disabled/>
                        <Button id="closeButton" onClick={props.onCloseModal} variant="contained">Close</Button>
                    </form>
                </div>
            </div>

            }
        </div>
    )
}

export default BillCreateModal;
