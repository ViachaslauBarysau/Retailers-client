import '../../Modal.css';
import React, {useEffect, useState} from 'react';
import {Button, TextField} from "@material-ui/core";


const CustomerEditModal = (props) => {

    const [customer, setCustomer] = useState(null)

    useEffect(() => {
        fetch('/api/customers/' + props.customerId, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(customer => {
                setCustomer(customer);
            });
    }, []);

    function editCustomer(e) {
        e.preventDefault();
        fetch('/api/customers', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(customer),
            method: "PUT"
        });
        props.onCloseModal();
    }

    let handleChange = (e) => setCustomer(
        (prevState) => {
            return (
                {...prevState, name: e.target.value}
            )
        });

    console.log(customer)

    return (
        <div>
            {customer &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={editCustomer}>
                        <TextField margin="dense" size="small" fullWidth={true} id="name" variant="outlined"
                                   label="Name"
                                   value={customer.name}
                                   onChange={handleChange}
                                   required/>
                        <TextField type="email" margin="dense" size="small" fullWidth={true} value={customer.email}
                                   id="email" variant="outlined" label="Email" disabled/>
                        <TextField type="email" margin="dense" size="small" fullWidth={true} value={customer.registrationDate}
                                   id="email" variant="outlined" label="Registration date" disabled/>
                        <TextField type="email" margin="dense" size="small" fullWidth={true} value={customer.customerStatus}
                                   id="email" variant="outlined" label="Status" disabled/>
                        <Button fullWidth={false} type="submit" variant="contained">Edit customer</Button>
                        <Button fullWidth={false} id="closeButton" type="button" onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>
    )
}

export default CustomerEditModal;