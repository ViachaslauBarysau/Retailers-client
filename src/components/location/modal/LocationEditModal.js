import '../../Modal.css';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {TextField} from "@material-ui/core";
import Button from '../../Button';
import InputLabel from "@material-ui/core/InputLabel";
import StateSelect from "../../StateSelect";
import {AuthContext} from "../../../context/authContext";

const LocationEditModal = (props) => {
    const {logout} = useContext(AuthContext);
    const [location, setLocation] = useState(null);

    let updateStateSelectValue = (e) => setLocation(
        (prevState) => {
            return (
                {
                    ...prevState,
                    address: {
                        ...prevState.address,
                        state: {
                            id: e.target.value
                        }
                    }
                })
        });

    let handleCityChange = (e) => setLocation(
        (prevState) => {
            return (
                {
                    ...prevState,
                    address: {
                        ...prevState.address,
                        city: e.target.value
                    }
                })
        });

    let handleAddressFirstChange = (e) => setLocation(
        (prevState) => {
            return (
                {
                    ...prevState,
                    address: {
                        ...prevState.address,
                        firstAddressLine: e.target.value
                    }
                })
        });

    let handleAddressSecondChange = (e) => setLocation(
        (prevState) => {
            return (
                {
                    ...prevState,
                    address: {
                        ...prevState.address,
                        secondAddressLine: e.target.value
                    }
                })
        });

    let handleIdentifierChange = (e) => setLocation(
        (prevState) => {
            return (
                {
                    ...prevState,
                    identifier: e.target.value
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
                                   onChange={handleIdentifierChange}
                                   required/>
                        <InputLabel id="state-label">State:</InputLabel>
                        <StateSelect onChangeState={updateStateSelectValue} value={location.address.state.id}/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={location.address.city}
                                   variant="outlined"
                                   label="City"
                                   onChange={handleCityChange}
                                   required/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={location.address.firstAddressLine}
                                   variant="outlined"
                                   label="Address line 1"
                                   onChange={handleAddressFirstChange}
                                   required/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={location.address.secondAddressLine}
                                   variant="outlined"
                                   label="Address line 2"
                                   onChange={handleAddressSecondChange}
                                   required/>
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
                                   value={location.locationTax}
                                   disabled/>
                        <Button my={1} variant="contained" type="submit">Edit location</Button>
                        <Button m={1} variant="contained" onClick={props.onCloseModal}>Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>

    )
}

export default LocationEditModal;