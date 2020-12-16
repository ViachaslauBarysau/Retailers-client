import '../../Modal.css';
import React, {useContext, useState} from 'react';
import StateSelect from '../../StateSelect';
import {TextField} from "@material-ui/core";
import Button from '../../Button';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {AuthContext} from "../../../context/authContext";
import {validateLocationCreation} from "../../../validation/LocationValidator";

const LocationCreateModal = (props) => {
    const {user, logout} = useContext(AuthContext);
    const [stateId, setStateId] = useState(1);
    const [validationResults, setValidationResults] = useState(["errors"]);

    function updateStateSelectValue(e) {
        setStateId(e.target.value)
    }

    const [locationType, setLocationType] = useState("WAREHOUSE");

    function handleLocationTypeChange(e) {
        setLocationType(e.target.value);
    }

    function addLocation(e) {
        e.preventDefault();
        let validResults = validateLocationCreation(e);
        if (validResults.length === 0) {
            fetch('/api/locations', {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    identifier: e.target.identifier.value,
                    customer: user.customer,
                    address: {
                        state:
                            {
                                id: stateId,
                            },
                        city: e.target.city.value,
                        firstAddressLine: e.target.address1.value,
                        secondAddressLine: e.target.address2.value
                    },
                    totalCapacity: e.target.total_capacity.value,
                    availableCapacity: e.target.total_capacity.value,
                    locationType: locationType,
                    locationTax: 0,
                    status: "ACTIVE"
                }),
                method: "POST"
            })
                .then(res => {
                    switch (res.status) {
                        case 201:
                            props.handleOpenSnackBar("Location created!", "success");
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
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
            <div className={"modal-box"}>
                <form onSubmit={addLocation}>
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               name="identifier"
                               variant="outlined"
                               label="Identifier"
                               error={validationResults.includes("identifier")}
                               helperText={validationResults.includes("identifier") ?
                                   "Identifier length must be between 3 and 30 symbols." : ""}/>
                    <InputLabel id="state-label">State:</InputLabel>
                    <StateSelect onChangeState={updateStateSelectValue} value={stateId}/>
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               name="city"
                               variant="outlined"
                               label="City"
                               error={validationResults.includes("city")}
                               helperText={validationResults.includes("city") ?
                                   "Min length 3 symbols!" : ""}
                    />
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               name="address1"
                               variant="outlined"
                               label="Address line 1"
                               error={validationResults.includes("firstAddressLine")}
                               helperText={validationResults.includes("firstAddressLine") ?
                                   "Min length 5 symbols!" : ""}
                    />
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               name="address2"
                               variant="outlined"
                               label="Address line 2"
                    />
                    <InputLabel id="type-label">Type:</InputLabel>
                    <Select
                        variant="outlined"
                        labelId="type-label"
                        value={locationType}
                        onChange={handleLocationTypeChange}
                    >
                        <MenuItem value={"WAREHOUSE"}>Warehouse</MenuItem>
                        <MenuItem value={"SHOP"}>Shop</MenuItem>
                    </Select>
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               type="number"
                               InputProps={{
                                   inputProps:
                                       {
                                           step: 1
                                       }
                               }}
                               name="total_capacity"
                               variant="outlined"
                               label="Total capacity"
                               error={validationResults.includes("totalCapacity")}
                               helperText={validationResults.includes("totalCapacity") ?
                                   "Must be greater than 0!" : ""}/>
                    <Button my={1} fullWidth={false}
                            type="submit"
                            variant="contained">Add location</Button>
                    <Button m={1} fullWidth={false}
                            id="closeButton"
                            type="button"
                            onClick={props.onCloseModal}
                            variant="contained">Close</Button>
                </form>
            </div>
        </div>
    )
}

export default LocationCreateModal;