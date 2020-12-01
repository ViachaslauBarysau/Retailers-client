import CustomerCreateModal from './modal/CustomerCreateModal';
import CustomerEditModal from './modal/CustomerEditModal';
import React, {useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";

export default () => {
    const [customersData, setData] = useState({
        isLoading: true,
        error: null,
        customers: [],
    });

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        customerId: null
    });

    const [selectedCustomersNumber, setSelectedCustomersNumber] = useState(0);

    function handleChange(e) {
        if (e.target.checked) {
            setSelectedCustomersNumber(selectedCustomersNumber + 1);
        } else {
            setSelectedCustomersNumber(selectedCustomersNumber - 1);
        }
    }

    useEffect(() => {
        fetch('http://localhost:8080/api/customers', {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(customers => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    customers
                }));
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [customersData.displayModal]);

    const {isLoading, error, customers} = customersData;

    function changeCustomerStatus(e) {
        e.preventDefault();
        let customerIdList = [];
        e.target.customers.forEach(element => {
            element.checked && customerIdList.push(Number(element.value));
        });

        fetch('http://localhost:8080/api/customers', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(customerIdList),
            method: "DELETE"
        });
    }

    return (
        <div>
            {isLoading && 'Loading....'}
            {!isLoading && !error &&
            <form onSubmit={changeCustomerStatus}>
                {(customers.length !== 0
                    ? <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Registration date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Admin's email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {customers.map(customer => <Customer customer={customer}
                                                                      key={customer.id}
                                                                      onChange={handleChange}
                                                                      onClick={() => setDisplayEditModal({
                                                                          displayModal: true,
                                                                          customerId: customer.id
                                                                      })}
                                />)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : 'Empty list')}
                <Button variant="contained" onClick={() => setDisplayCreateModal(true)}>
                    Add customer
                </Button>
                <Button variant="contained" type="submit" disabled={selectedCustomersNumber === 0}>
                    Enable/Disable
                </Button>
            </form>

            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <CustomerCreateModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <CustomerEditModal customerId={displayEditModal.customerId}
                                                                onCloseModal={() => setDisplayEditModal({
                                                                    displayModal: false,
                                                                    customerId: null
                                                                })}
            />}
        </div>
    );
}

function Customer(props) {
    return (
        <TableRow key={props.customer.id}>
            <TableCell component="th" scope="row">
                <input type="checkbox"
                       value={props.customer.id}
                       name={"customers"}
                       onChange={props.onChange}/>
            </TableCell>
            <TableCell>
                <a href="#" onClick={props.onClick}>{props.customer.name}</a>
            </TableCell>
            <TableCell>{props.customer.registrationDate}</TableCell>
            <TableCell>{props.customer.customerStatus}</TableCell>
            <TableCell>{props.customer.email}</TableCell>
        </TableRow>
    )
}
