import '../../Modal.css';
import React, {useContext, useMemo, useState} from 'react';
import {TextField} from "@material-ui/core";
import Button from '../../Button';
import {AuthContext} from "../../../context/authContext";
import {validateCustomerCreation} from "../../../validation/CustomerValidator";

const CustomerCreateModal = (props) => {
    const {logout} = useContext(AuthContext);
    const [validationResults, setValidationResults] = useState([]);

    function addCustomer(e) {
        e.preventDefault();
        let validResults = validateCustomerCreation(e);
        if (validResults.length === 0) {
            fetch('/api/customers', {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    customerStatus: "ACTIVE",
                    name: e.target.name.value,
                    email: e.target.email.value,
                    registrationDate: dateTime
                }),
                method: "POST"
            })
                .then(res => {
                    switch (res.status) {
                        case 201:
                            props.handleOpenSnackBar("Customer created!", "success");
                            props.onCloseModal();
                            props.needrefresh();
                            break;
                        case 401:
                            logout();
                            break;
                        case 451:
                            props.handleOpenSnackBar("Email should be unique!", "warning");
                            break;
                    }
                })
                .catch(e => {
                    props.handleOpenSnackBar("Error happens!", "error");
                });
        }
        setValidationResults(validResults);
    }

    let dateTime = useMemo(() => new Date(), [])

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal}
                 className={"modal-backdrop"}/>
            <div className={"modal-box"}>
                <form onSubmit={addCustomer}>
                    <TextField size="small"
                               fullWidth={true}
                               id="name"
                               variant="outlined"
                               error={validationResults.includes("name")}
                               helperText={validationResults.includes("name") ? "Name length must be between 4 and 40 characters!" : " "}
                               label="Name"/>
                    <TextField
                        size="small"
                        fullWidth={true}
                        id="email"
                        variant="outlined"
                        error={validationResults.includes("email")}
                        helperText={validationResults.includes("email") ? "Incorrect email!" : " "}
                        label="Email"/>
                    <Button my={1} fullWidth={false}
                            type="submit"
                            variant="contained">Add customer</Button>
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

export default CustomerCreateModal;
