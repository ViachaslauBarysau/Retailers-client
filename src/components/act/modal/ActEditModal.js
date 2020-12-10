import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {TextField} from "@material-ui/core";
import Button from '../../Button';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {AuthContext} from "../../../context/authContext";

const ActEditModal = (props) => {
    const {logout} = useContext(AuthContext);
    let [act, setAct] = useState(null);

    useEffect(() => {
        fetch('/api/write_off_acts/' + props.actId, {
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
            .then(act => {
                setAct(act);
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            })
    }, []);

    return (
        <div>
            {act &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal}
                     className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form>
                        <TextField margin="dense"
                                   name="actNumber"
                                   size="small"
                                   fullWidth={true}
                                   value={act.writeOffActNumber}
                                   variant="outlined"
                                   label="Write-off act number"
                                   disabled/>
                        <div className="scrollable-box-edit-modal">
                            <TableContainer component={Paper}>
                                <Table size="small"
                                       aria-label="a dense table">
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
                                                <TableCell component="th"
                                                           scope="row"
                                                >
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
                        <TextField margin="dense"
                                   name="date"
                                   size="small"
                                   fullWidth={true}
                                   value={act.actDateTime}
                                   variant="outlined"
                                   label="Date and time"
                                   disabled/>
                        <TextField margin="dense"
                                   name="sum"
                                   size="small"
                                   fullWidth={true}
                                   value={act.totalProductSum}
                                   variant="outlined"
                                   label="Total cost of items"
                                   disabled/>
                        <Button mt={1} fullWidth={false}
                                id="closeButton"
                                type="button"
                                onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>
    )
}

export default ActEditModal;
