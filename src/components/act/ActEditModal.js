import '../../modals/Modal.css';
import React, {useEffect, useState} from 'react';
import {Button, TextField} from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

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

    console.log(act)

    return (
        <div>
            {act &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form>
                        <div className="scrollable-box">
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>UPC</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                            <TableCell align="right">Reason</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {act.writeOffActRecords.map((record) => (
                                            <TableRow key={record.product.upc}>
                                                <TableCell component="th" scope="row">
                                                    {record.product.upc}
                                                </TableCell>
                                                <TableCell align="right">{record.amount}</TableCell>
                                                <TableCell align="right">{record.reason}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <br/>
                        </div>
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
            }
        </div>
    )
}

export default ActEditModal;
