import '../../Modal.css';
import React, {useEffect, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../Button';
import InputLabel from "@material-ui/core/InputLabel";
import StateSelect from "../../StateSelect";

const SupplierEditModal = (props) => {
    const [warehouse, setWarehouse] = useState(props.editedWarehouse);

    // useEffect(() => {
    //     if (props.editedWarehouse) {
    //         setWarehouse(props.editedWarehouse);
    //     }
    // }, []);

    function handleStateChange(e) {
        setWarehouse((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    state: {
                        ...prevState.address.state,
                        id: e.target.value
                    }
                }
            })
        )
    }

    function handleNameChange(e) {
        setWarehouse((prevState) => ({
                ...prevState,
                name: e.target.value
            })
        )
    }

    function handleCityChange(e) {
        setWarehouse((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    city: e.target.value
                }
            })
        )
    }

    function handleFirstAddressLineChange(e) {
        setWarehouse((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    address1: e.target.value
                }
            })
        )
    }

    function handleSecondAddressLineChange(e) {
        setWarehouse((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    address2: e.target.value
                }
            })
        )
    }

    function changeRecord(e) {
        e.preventDefault();
        props.addWarehouse(warehouse);
        props.onClose();
    }

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onClose} className={"modal-backdrop upper-modal-backdrop"}/>
            <div className={"modal-box upper-modal-box"}>
                <form>
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               id="fullName"
                               name="fullName"
                               variant="outlined"
                               label="Name"
                               value={warehouse.name}
                               onChange={handleNameChange}
                    />
                    <InputLabel id="state-label">State:</InputLabel>
                    <StateSelect onChangeState={handleStateChange}
                                 value={warehouse.address.state.id}
                    />
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               name="city"
                               variant="outlined"
                               label="City"
                               value={warehouse.address.city}
                               onChange={handleCityChange}
                        // error={validationResults.includes("city")}
                        // helperText={validationResults.includes("city") ?
                        //     "Min length 3 symbols!" : ""}
                    />
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               name="address1"
                               variant="outlined"
                               label="Address line 1"
                               value={warehouse.address.address1}
                               onChange={handleFirstAddressLineChange}
                        // error={validationResults.includes("firstAddressLine")}
                        // helperText={validationResults.includes("firstAddressLine") ?
                        //     "Min length 5 symbols!" : ""}
                    />
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               name="address2"
                               variant="outlined"
                               label="Address line 2"
                               value={warehouse.address.address2}
                               onChange={handleSecondAddressLineChange}
                    />

                    <Button my={1} onClick={changeRecord} variant="contained">Change record</Button>
                    {/*<br/>*/}
                    {/*<Button my={1} type="submit"*/}
                    {/*        variant="contained">Add supplier</Button>*/}
                    <Button m={1} id="closeButton"
                            onClick={props.onClose}
                            variant="contained">Close</Button>
                </form>
            </div>

        </div>
    )
}

export default SupplierEditModal;
