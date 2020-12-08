import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {Button, TextField} from "@material-ui/core";
import {AuthContext} from "../../../context/authContext";


const CustomerEditModal = (props) => {
    const { logout } = useContext(AuthContext);
    const [customer, setCustomer] = useState(null)

    useEffect(() => {
        fetch('/api/customers/' + props.customerId, {
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
                };
            })
            .then(customer => {
                setCustomer(customer);
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
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
        })
            .then(res => {
                if (res.ok) {
                    props.handleOpenSnackBar("Customer updated!", "success");
                    props.onCloseModal();
                    props.needrefresh();
                } else if (res.status === 401) {
                    logout();
                };
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            });
    }

    let handleChange = (e) => setCustomer(
        (prevState) => {
            return (
                {...prevState, name: e.target.value}
            )
        });

    return (
        <div>
            {customer &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={editCustomer}>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   id="name"
                                   variant="outlined"
                                   label="Name"
                                   value={customer.name}
                                   onChange={handleChange}
                                   required/>
                        <TextField type="email"
                                   margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={customer.email}
                                   id="email"
                                   variant="outlined"
                                   label="Email"
                                   disabled/>
                        <TextField type="email"
                                   margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={customer.registrationDate}
                                   id="email"
                                   variant="outlined"
                                   label="Registration date"
                                   disabled/>
                        <TextField type="email"
                                   margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={customer.customerStatus}
                                   id="email"
                                   variant="outlined"
                                   label="Status"
                                   disabled/>
                        <Button fullWidth={false}
                                type="submit"
                                variant="contained">Edit customer</Button>
                        <Button fullWidth={false}
                                id="closeButton"
                                type="button"
                                onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>
    )
}

export default CustomerEditModal;