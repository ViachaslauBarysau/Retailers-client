import '../../../../modals/Modal.css';
import React, {useEffect, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";


const SupplierAppEditModal = (props) => {
    const [application, setApplication] = useState(null)
    const [locations, setLocations] = useState(null)

    useEffect(() => {
        fetch('http://localhost:8080/api/inner_applications/' + props.appId, {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(application => {
                setApplication(application);
            })
            .catch(e => {
                //TODO: Add logic
            });
        fetch('http://localhost:8080/api/locations/shops', {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        }).then(res => res.json())
            .then(locations => {
                setLocations(locations);
            })
            .catch(e => {
                //TODO: Add logic
            });
    }, []);

    const acceptProducts = () => {
        fetch('http://localhost:8080/api/supplier_applications/status/', {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(props.appId)
        });
    }

    const forwardApplication = (e) => {
        e.preventDefault();
        console.log(e.target.location);
        fetch('http://localhost:8080/api/inner_applications/', {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "PUT",
            body: JSON.stringify({
                id: application.id,
                destinationLocation: {
                    id: locations.filter(location => location.identifier === e.target.location.value)[0].id
                }
            })
        });
    }

    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });

    return (
        <div>
            {application && locations &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form className="supplier-app-modal" onSubmit={forwardApplication}>
                        <TextField margin={"dense"} size="small" fullWidth={true} value={application.applicationNumber}
                                   variant="outlined"
                                   label="Application number" disabled/>
                        <TextField margin={"dense"} size="small" fullWidth={true} value={application.sourceLocation.identifier}
                                   variant="outlined"
                                   label="Supplier" disabled/>
                        <Autocomplete
                            size="small"
                            clearOnEscape
                            options={locations.map((option) => option.identifier.toString())}
                            defaultValue={application.destinationLocation.identifier}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth={true} label="Warehouse" margin="normal" name="location"
                                           variant="outlined"
                                           required/>
                            )}
                        />
                        <TextField margin={"dense"} size="small" fullWidth={true} variant="outlined" value={application.creator.firstName
                        + " " + application.creator.lastName}
                                   label="Created by" disabled/>
                        <TextField margin={"dense"} size="small" fullWidth={true} variant="outlined" value={application.updater.firstName
                        + " " + application.updater.lastName}
                                   label="Updated by" disabled/>
                        <TextField margin={"dense"} size="small" fullWidth={true} variant="outlined"
                                   value={application.registrationDateTime}
                                   label="Registration date and time" disabled/>
                        <TextField margin={"dense"} size="small" fullWidth={true} variant="outlined" value={application.updatingDateTime}
                                   label="Updating date and time" disabled/>
                        <TextField margin={"dense"} size="small" fullWidth={true} variant="outlined"
                                   value={application.applicationStatus}
                                   label="Status"
                                   disabled/>
                        <div className="scrollable-box">
                                <TableContainer component={Paper}>
                                    <Table className={useStyles.table} size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>UPC</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                                <TableCell align="right">Cost</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {application.recordsList.map((record) => (
                                                <TableRow key={record.product.upc}>
                                                    <TableCell component="th" scope="row">
                                                        {record.product.upc}
                                                    </TableCell>
                                                    <TableCell align="right">{record.amount}</TableCell>
                                                    <TableCell align="right">{record.cost}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <br/>
                        </div>
                        <TextField margin={"dense"} size="small" fullWidth={true} variant="outlined"
                                   value={application.totalProductAmount}
                                   label="Total amount of products"
                                   disabled/>
                        <TextField margin={"dense"} size="small" fullWidth={true} variant="outlined" value={application.totalUnitNumber}
                                   label="Total volume of products" disabled/>
                        <br/>
                        <Button type="submit" variant="contained">Forward application</Button>
                        <Button variant="contained" onClick={acceptProducts}>Accept products</Button>
                        <Button id="closeButton" onClick={props.onCloseModal} variant="contained">Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>
    )
}

export default SupplierAppEditModal;