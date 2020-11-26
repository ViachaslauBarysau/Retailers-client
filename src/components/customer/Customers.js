import CustomerCreateModal from './CustomerCreateModal';
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
        displayModal: false
    });

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

    const {isLoading, error, customers, displayModal} = customersData;

    function changeCustomerStatus(e) {
        e.preventDefault();
        let customerIdList = [];
        e.target.customers.forEach(element => {
            element.checked && customerIdList.push(Number(element.value));
        });
        console.log(customerIdList);
        fetch('http://localhost:8080/api/customers', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(customerIdList),
            method: "PUT"
        });
    }

    return (
        <>
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
                                {customers.map(customer => <Customers customer={customer} key={customer.id}/>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : 'Empty list')}
                <Button variant="contained" onClick={() => setData((prevState) => ({
                    ...prevState,
                    displayModal: true
                }))}>
                    Add customer
                </Button>
                <Button variant="contained" type="submit">
                    Enable/Disable
                </Button>
            </form>

            }
            {!isLoading && error && 'Error happens'}
            {displayModal &&
            <CustomerCreateModal onClick={() => setData((prevState) => ({...prevState, displayModal: false}))}/>}
        </>
    );
}


function Customers({customer}) {
    return (
        <TableRow key={customer.id}>
            <TableCell component="th" scope="row">
                <input type="checkbox"
                       value={customer.id}
                       name={"customers"}/>
            </TableCell>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.registrationDate}</TableCell>
            <TableCell>{customer.customerStatus}</TableCell>
            <TableCell>{customer.email}</TableCell>
        </TableRow>
    )
}