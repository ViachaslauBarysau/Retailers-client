import '../../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../../Button';
import Autocomplete from "@material-ui/lab/Autocomplete";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import {AuthContext} from "../../../../context/authContext";


const SupplierAppEditModal = (props) => {
    const {logout} = useContext(AuthContext);
    const [application, setApplication] = useState(null)
    const [locations, setLocations] = useState(null)

    useEffect(() => {
        fetch('/api/inner_applications/' + props.appId, {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
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
            .then(application => {
                setApplication(application);
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            });
        fetch('/api/locations/shops?size=1000', {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
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
            .then(locations => {
                setLocations(locations.content);
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            });
    }, []);

    const acceptProducts = () => {
        if (application.totalUnitNumber > application.destinationLocation.availableCapacity) {
            props.handleOpenSnackBar("No enough space!", "warning");
        } else {
            fetch('/api/inner_applications/status/', {
                headers: {
                    "Authorization": localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(props.appId),
                method: "PUT"
            })
                .then(res => {
                    if (res.ok) {
                        props.handleOpenSnackBar("Products accepted!", "success");
                        props.onCloseModal();
                        props.needrefresh();
                    } else if (res.status === 401) {
                        logout();
                    } else if (res.status === 451) {
                        props.handleOpenSnackBar("No enough space!", "warning");
                    }
                })
                .catch(e => {
                    props.handleOpenSnackBar("Error happens!", "error");
                });
        }
    }

    const forwardApplication = (e) => {
        e.preventDefault();
        fetch('/api/inner_applications/', {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                ...application,
                destinationLocation: locations.filter(location => location.identifier === e.target.location.value)[0]
            }),
            method: "PUT"
        })
            .then(res => {
                if (res.ok) {
                    props.handleOpenSnackBar("Application forwarded!", "success");
                    props.onCloseModal();
                    props.needrefresh();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            });
    }

    return (
        <div>
            {application && locations &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form className="supplier-app-modal" onSubmit={forwardApplication}>
                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   value={application.applicationNumber}
                                   variant="outlined"
                                   label="Application number"
                                   disabled/>
                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   value={application.sourceLocation.identifier}
                                   variant="outlined"
                                   label="Source location"
                                   disabled/>
                        <Autocomplete
                            disabled={application.applicationStatus === "FINISHED_PROCESSING"}
                            size="small"
                            clearOnEscape
                            options={locations.map((option) => option.identifier.toString())}
                            defaultValue={application.destinationLocation.identifier}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth={true} label="Destination location" margin="normal"
                                           name="location"
                                           variant="outlined"
                                />
                            )}
                        />
                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.creator.firstName + " " + application.creator.lastName}
                                   label="Created by" disabled/>
                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.updater.firstName + " " + application.updater.lastName}
                                   label="Updated by"
                                   disabled/>
                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.registrationDateTime}
                                   label="Registration date and time"
                                   disabled/>
                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.updatingDateTime}
                                   label="Updating date and time" disabled/>
                        <TextField margin={"dense"} size="small" fullWidth={true} variant="outlined"
                                   value={application.applicationStatus}
                                   label="Status"
                                   disabled/>
                        <div className="scrollable-box-edit-modal">
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
                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.totalProductAmount}
                                   label="Total amount of products"
                                   disabled/>
                        <TextField margin={"dense"}
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   value={application.totalUnitNumber}
                                   label="Total volume of products"
                                   disabled/>
                        <br/>
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
                        <Button m={1} type="submit"
                                variant="contained"
                                disabled={application.applicationStatus === "FINISHED_PROCESSING"}>Forward
                            application</Button>
                        <Button m={1} variant="contained"
                                onClick={acceptProducts}
                                disabled={application.applicationStatus === "FINISHED_PROCESSING" ||
                                application.totalUnitNumber >= application.destinationLocation.availableCapacity}>Accept
                            products</Button>
                        <Button m={1} id="closeButton"
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