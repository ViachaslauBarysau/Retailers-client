import '../../modals/Modal.css';
import React, {useEffect, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

const SupplierAppEditModal = (props) => {
    const [application, setApplication] = useState(null)
    const [locations, setLocations] = useState(null)

    useEffect(() => {
        fetch('http://localhost:8080/api/supplier_applications/' + props.appId, {
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
        fetch('http://localhost:8080/api/locations/', {
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
        fetch('http://localhost:8080/api/supplier_applications/supplier_application_status/', {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(props.appId)
        });
    }

    return (
        <div>
            {application && locations &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form className="supplier-app-modal">
                        <TextField size="small" fullWidth={true} value={String(application.applicationNumber)}
                                   variant="outlined"
                                   label="Application number" disabled/>
                        <TextField size="small" fullWidth={true} value={application.supplier.fullName}
                                   variant="outlined"
                                   label="Supplier" disabled/>
                        <Autocomplete
                            size="small"
                            name="location"
                            clearOnEscape
                            options={locations.map((option) => option.identifier.toString())}
                            defaultValue={application.destinationLocation}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth={true} label="Warehouse" margin="normal"
                                           variant="outlined"
                                           id="supplier" required/>
                            )}
                        />
                        <TextField size="small" fullWidth={true} variant="outlined" value={application.creator.firstName
                        + " " + application.creator.lastName}
                                   label="Created by" disabled/>
                        <TextField size="small" fullWidth={true} variant="outlined" value={application.updater.firstName
                        + " " + application.updater.lastName}
                                   label="Updated by" disabled/>
                        <TextField size="small" fullWidth={true} variant="outlined" value={application.registrationDateTime}
                                   label="Registration date and time" disabled/>
                        <TextField size="small" fullWidth={true} variant="outlined" value={application.updatingDateTime}
                                   label="Updating date and time" disabled/>
                        <TextField size="small" fullWidth={true} variant="outlined" value={application.applicationStatus}
                                   label="Status"
                                   disabled/>

                        {/*{itemRows.items.map((item) => (<ApplicationRecord item={item} products={productsData.products}*/}
                        {/*                                                  changeRecord={changeRecord}*/}
                        {/*                                                  key={item.key}/>))}*/}
                        <br/>

                        <TextField size="small" fullWidth={true} variant="outlined" value={application.totalProductAmount}
                                   label="Total amount of products"
                                   disabled/>
                        <TextField size="small" fullWidth={true} variant="outlined" value={application.totalUnitNumber}
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