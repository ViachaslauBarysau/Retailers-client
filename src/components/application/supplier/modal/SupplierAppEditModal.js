import '../../../Modal.css';
import React, {useEffect, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";
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
        fetch('/api/supplier_applications/' + props.appId, {
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
        fetch('/api/locations/warehouses', {
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
        fetch('/api/supplier_applications/status/', {
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
        fetch('/api/supplier_applications/', {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "PUT",
            body: JSON.stringify({
                ...application,
                destinationLocation: locations.filter(location => location.identifier === e.target.location.value)[0]
            })
        });
        props.onCloseModal();
        props.needrefresh()
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
                <div onClick={props.onCloseModal}
                     className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form className="supplier-app-modal"
                          onSubmit={forwardApplication}>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={application.applicationNumber}
                                   variant="outlined"
                                   label="Application number"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={application.supplier.fullName}
                                   variant="outlined"
                                   label="Supplier"
                                   disabled/>
                        <Autocomplete
                            size="small"
                            disabled={application.applicationStatus === "FINISHED_PROCESSING"}
                            clearOnEscape
                            options={locations.map((option) => option.identifier.toString())}
                            defaultValue={application.destinationLocation.identifier}
                            renderInput={(params) => (
                                <TextField {...params}
                                           fullWidth={true}
                                           label="Warehouse"
                                           margin="normal"
                                           name="location"
                                           variant="outlined"
                                           required/>
                            )}
                        />
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.creator.firstName + " " + application.creator.lastName}
                                   label="Created by"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.updater.firstName + " " + application.updater.lastName}
                                   label="Updated by"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.registrationDateTime}
                                   label="Registration date and time"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.updatingDateTime}
                                   label="Updating date and time"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.applicationStatus}
                                   label="Status"
                                   disabled/>
                        <div className="scrollable-box-edit-modal">
                            <TableContainer component={Paper}>
                                <Table className={useStyles.table}
                                       size="small"
                                       aria-label="a dense table">
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
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.totalProductAmount}
                                   label="Total amount of products"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.totalUnitNumber}
                                   label="Total volume of products"
                                   disabled/>

                        {application.applicationStatus === "OPEN" &&
                        <div>
                            <TextField margin={"dense"}
                                       size="small"
                                       fullWidth={true}
                                       variant="outlined"
                                       value={application.destinationLocation.availableCapacity}
                                       label="Available capacity at current location"
                                       InputProps={{
                                           style: {backgroundColor: "#FFFAF0"},
                                       }}
                                       disabled/>
                        </div>
                        }
                        <br/>
                        <Button type="submit"
                                variant="contained"
                                disabled={application.applicationStatus === "FINISHED_PROCESSING"}>Forward
                            application</Button>
                        <Button variant="contained"
                                onClick={acceptProducts}
                                disabled={application.applicationStatus === "FINISHED_PROCESSING" ||
                                application.totalUnitNumber >= application.destinationLocation.availableCapacity}>Accept
                            products</Button>
                        <Button id="closeButton"
                                onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>
    )
}

export default SupplierAppEditModal;