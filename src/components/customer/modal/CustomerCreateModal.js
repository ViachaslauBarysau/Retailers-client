import '../../Modal.css';
import React, {useMemo} from 'react';
import {Button, TextField} from "@material-ui/core";


const CustomerCreateModal = (props) => {

    function addCustomer(e) {
        e.preventDefault();
        fetch('http://localhost:8080/api/customers', {
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
        });
        props.onCloseModal();
    }

    let dateTime = useMemo(() => new Date(), [])

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
            <div className={"modal-box"}>
                <form onSubmit={addCustomer}>
                    <TextField margin="dense" size="small" fullWidth={true} id="name" variant="outlined" label="Name"
                               required/>
                    <TextField type="email" margin="dense" size="small" fullWidth={true}
                               id="email" variant="outlined" label="Email" required/>
                    <Button fullWidth={false} type="submit" variant="contained">Add customer</Button>
                    <Button fullWidth={false} id="closeButton" type="button" onClick={props.onCloseModal}
                            variant="contained">Close</Button>
                </form>
            </div>
        </div>
    )
}


export default CustomerCreateModal;
