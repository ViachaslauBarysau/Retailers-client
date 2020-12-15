import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {TextField} from "@material-ui/core";
import Button from '../../Button';
import {AuthContext} from "../../../context/authContext";
import {validateLocationEditing} from "../../../validation/LocationValidator";
import {validateLocationTaxEditing} from "../../../validation/LocationTaxValidator";

const LocationTaxEditModal = (props) => {
    const {logout} = useContext(AuthContext);
    const [location, setLocation] = useState(null);
    const [validationResults, setValidationResults] = useState(["errors"]);

    let handleLocationTaxChange = (e) => setLocation(
        (prevState) => {
            return (
                {
                    ...prevState,
                    locationTax: e.target.value,
                })
        });

    useEffect(() => {
        fetch('/api/locations/' + props.locationId, {
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
            .then(location => {
                setLocation(location);
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            });
    }, []);

    function editLocation(e) {
        e.preventDefault();
        let validResults = validateLocationTaxEditing(location)
        if (validResults.length === 0) {
            fetch('/api/locations', {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(location),
                method: "PUT"
            })
                .then(res => {
                    switch (res.status) {
                        case 200:
                            props.handleOpenSnackBar("Location updated!", "success");
                            props.onCloseModal();
                            props.needrefresh();
                            break;
                        case 401:
                            logout();
                            break;
                        case 451:
                            props.handleOpenSnackBar("Identifier should be unique!", "warning");
                            break;
                    }
                })
                .catch(e => {
                    props.handleOpenSnackBar("Error happens!", "error");
                });
        }
        setValidationResults(validResults);
    }


    return (
        <div>
            {location &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={editLocation}>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Identifier"
                                   value={location.identifier}
                                   disabled
                        />

                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={location.address.state.id}
                                   variant="outlined"
                                   label="State"
                                   disabled
                        />
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={location.address.city}
                                   variant="outlined"
                                   label="City"
                                   disabled
                        />
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={location.address.firstAddressLine}
                                   variant="outlined"
                                   label="Address line 1"
                                   disabled
                        />
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={location.address.secondAddressLine}
                                   variant="outlined"
                                   label="Address line 2"
                                   disabled
                        />
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={location.locationType}
                                   variant="outlined"
                                   label="Type"
                                   disabled/>
                        <TextField margin="dense"
                                   type="number"
                                   size="small"
                                   fullWidth={true}
                                   id="total_capacity"
                                   variant="outlined"
                                   label="Total capacity"
                                   value={location.totalCapacity}
                                   disabled/>
                        <TextField margin="dense"
                                   size="number"
                                   fullWidth={true}
                                   id="available_capacity"
                                   variant="outlined"
                                   label="Available capacity"
                                   value={location.availableCapacity}
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Location tax"
                                   onChange={handleLocationTaxChange}
                                   value={location.locationTax}
                                   error={validationResults.includes("locationTax")}
                                   helperText={validationResults.includes("locationTax") ?
                                       "Minimum tax rate is 0." : ""}

                        />
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="State tax"
                                   value={location.address.state.stateTax}
                                   disabled
                        />
                        <Button my={1} variant="contained" type="submit">Edit tax</Button>
                        <Button m={1} variant="contained" onClick={props.onCloseModal}>Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>

    )
}

export default LocationTaxEditModal;