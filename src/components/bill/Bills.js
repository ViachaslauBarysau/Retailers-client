import BillCreateModal from './modal/BillCreateModal';
import React, {useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import BillEditModal from "./modal/BillEditModal";

export default () => {
    const [billsData, setData] = useState({
        isLoading: false,
        error: null,
        bills: [],
    });

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        billId: null
    });


    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('http://localhost:8080/api/bills', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(bills => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    bills
                }));
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, []);

    const {isLoading, error, bills, displayModal} = billsData;

    return (
        <div>
            {isLoading && 'Loading....'}
            {!isLoading && !error &&
            (bills.length != 0
                ? <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Bill number</TableCell>
                                <TableCell align="right">Total amount of items</TableCell>
                                <TableCell align="right">Total price of items</TableCell>
                                <TableCell align="right">Date and Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bills.map(bill => <Bills bill={bill} key={bill.id}/>)}
                        </TableBody>
                    </Table>
                </TableContainer>
                : 'Empty list')
            }
            {!isLoading && error && 'Error happens'}
            <Button variant="contained" onClick={() => setDisplayCreateModal(true)}>
                Add bill
            </Button>
            {displayCreateModal && <BillCreateModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <BillEditModal billId={displayEditModal.billId}
                                                             onCloseModal={() => setDisplayEditModal({
                                                                 displayModal: false,
                                                                 billId: null
                                                             })}
            />}
        </div>
    );

    function Bills({bill}) {
        return (
            <TableRow key={bill.billNumber}>
                <TableCell component="th" scope="row">
                    <a href="#" onClick={() => setDisplayEditModal({
                        displayModal: true,
                        billId: bill.id
                    })}
                    >{bill.billNumber}</a>
                </TableCell>
                <TableCell align="right">{bill.totalProductAmount}</TableCell>
                <TableCell align="right">{bill.totalPrice}</TableCell>
                <TableCell align="right">{bill.registrationDateTime}</TableCell>
            </TableRow>
        )
    }
}

