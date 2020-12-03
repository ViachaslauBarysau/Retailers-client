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
import Pagination from "@material-ui/lab/Pagination";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

export default () => {
    const [billsData, setData] = useState({
        isLoading: false,
        error: null,
        bills: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1)

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        billId: null
    });

    const handleChangePage = (event, value) => {
        setPageNumber(value - 1);
    };

    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('http://localhost:8080/api/bills?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(billsPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    bills: billsPage.content
                }));
                setPageCount(billsPage.totalPages);
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber]);

    const {isLoading, error, bills} = billsData;

    return (
        <div>
            {isLoading && <LinearProgress  />}
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
                : 'Empty list')}
            <Pagination count={pageCount} showFirstButton showLastButton page={pageNumber + 1}
                        onChange={handleChangePage}/>
            <Button variant="contained" onClick={() => setDisplayCreateModal(true)}>
                Add bill
            </Button>
            {!isLoading && error && 'Error happens'}
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

