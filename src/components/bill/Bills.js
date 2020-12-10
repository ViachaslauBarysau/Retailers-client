import BillCreateModal from './modal/BillCreateModal';
import React, {useEffect, useState} from 'react';
import Button from '../Button';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import BillEditModal from "./modal/BillEditModal";
import {StyledTableRow} from "../Table"
import {StyledTableCell} from "../Table"
import TablePagination from '@material-ui/core/TablePagination';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import {editToLocalTimeAndGet} from "../../util/DateAndTime";

export default () => {
    const [billsData, setData] = useState({
        isLoading: false,
        error: null,
        bills: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        billId: null
    });

    const handleChangeRowsPerPage = (event) => {
        setElementsOnPage(+event.target.value);
        setPageNumber(0);
    };

    const handleChangePage = (event, newPage) => {
        setPageNumber(newPage);
    };

    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('/api/bills?page=' + pageNumber + '&size=' + elementsOnPage, {
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
                setTotalElements(billsPage.totalElements)
                if (pageNumber > billsPage.totalPages - 1) {
                    setPageNumber(pageNumber - 1);
                }
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber, elementsOnPage]);

    const {isLoading, error, bills} = billsData;

    return (
        <div>
            {isLoading && <LinearProgress/>}
            {!isLoading && !error &&
            (bills.length != 0
                ?
                <div>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Bill number</StyledTableCell>
                                    <StyledTableCell>Total amount of items</StyledTableCell>
                                    <StyledTableCell>Total price of items</StyledTableCell>
                                    <StyledTableCell>Date and Time</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bills.map(bill => <Bills bill={bill}
                                                          key={bill.id}/>)}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 20]}
                            component="div"
                            count={totalElements}
                            page={pageNumber}
                            onChangePage={handleChangePage}
                            rowsPerPage={elementsOnPage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </TableContainer>

                </div>
                : 'Empty list')}
            <Button my={1} variant="contained"
                    onClick={() => setDisplayCreateModal(true)}>
                Add bill</Button>
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
            <StyledTableRow key={bill.billNumber}>
                <StyledTableCell component="th" scope="row">
                    <a href="#" onClick={() => setDisplayEditModal({
                        displayModal: true,
                        billId: bill.id
                    })}
                    >{bill.billNumber}</a>
                </StyledTableCell>
                <StyledTableCell align="left">{bill.totalProductAmount}</StyledTableCell>
                <StyledTableCell align="left">{bill.totalPrice}</StyledTableCell>
                <StyledTableCell align="left">{editToLocalTimeAndGet(bill.registrationDateTime)}</StyledTableCell>
            </StyledTableRow>
        )
    }
}

