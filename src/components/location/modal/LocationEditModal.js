import '../../Modal.css';
import React, {useEffect, useState} from 'react';
import {Button, TextField} from "@material-ui/core";

const LocationEditModal = (props) => {
    let [location, setLocation] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/locations/' + props.locationId, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(location => {
                setLocation(location);
            });
    }, []);


    return (

        <div>
            {location &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form>
                        <TextField margin="dense" size="small" fullWidth={true} variant="outlined"
                                   label="Identifier" value={location.identifier}
                                   disabled/>
                        <TextField margin="dense" size="small" fullWidth={true} variant="outlined"
                                   label="State" value={location.address.state.name}
                                   disabled/>
                        <TextField margin="dense" size="small" fullWidth={true} value={location.address.city}
                                   variant="outlined" label="City"
                                   disabled/>
                        <TextField margin="dense" size="small" fullWidth={true}
                                   value={location.address.firstAddressLine} variant="outlined" label="Address line 1"
                                   disabled/>
                        <TextField margin="dense" size="small" fullWidth={true}
                                   value={location.address.secondAddressLine} variant="outlined" label="Address line 2"
                                   disabled/>
                        <TextField margin="dense" size="small" fullWidth={true} value={location.Type} variant="outlined"
                                   label="Address line 2"
                                   disabled/>
                        <TextField margin="dense" type="number" size="small" fullWidth={true}
                                   id="total_capacity" variant="outlined" label="Total capacity"
                                   value={location.totalCapacity}
                                   disabled/>
                        <TextField margin="dense" size="number" fullWidth={true} id="available_capacity"
                                   variant="outlined" label="Available capacity" value={location.availableCapacity}
                                   disabled/>
                        <TextField margin="dense" size="small" fullWidth={true} variant="outlined" label="Location tax"
                                   value={location.locationTax}
                                   disabled/>
                        <Button variant="contained" onClick={props.onCloseModal}>
                            Close
                        </Button>
                    </form>
                </div>
            </div>}

        </div>

    )
}

export default LocationEditModal;