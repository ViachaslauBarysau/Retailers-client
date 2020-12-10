import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../Button';
import {AuthContext} from "../../../context/authContext";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

const BillCreateModal = (props) => {
    const {user, logout} = useContext(AuthContext);
    const [bill, setIBill] = useState(null);

    useEffect(() => {
        fetch('/api/bills/' + props.billId, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .then(bill => {
                setIBill(bill)
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            })
    }, []);


    console.log(props.billId)
    return (
        <div>
            {bill &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Bill number"
                                   value={bill.billNumber}
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={user.location.identifier}
                                   label="Location identifier"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Manager information"
                                   value={`${bill.shopManager.firstName} ${bill.shopManager.lastName}`}
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Registration date and time"
                                   value={bill.registrationDateTime}
                                   disabled/>
                        <div className="scrollable-box-edit-modal">
                            <TableContainer component={Paper}>
                                <Table size="small"
                                       aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>UPC</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                            <TableCell align="right">Price</TableCell>
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
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Total product amount"
                                   value={bill.totalProductAmount}
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={bill.totalPrice}
                                   label="Total price"
                                   disabled/>
                        <Button my={1} id="closeButton"
                                onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>

            }
        </div>
    )
}

export default BillCreateModal;
