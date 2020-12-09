import ActCreateModal from './modal/ActCreateModal';
import ActEditModal from './modal/ActEditModal';
import React, {useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Pagination from "@material-ui/lab/Pagination";
import {editToLocalTimeAndGet} from "../../util/DateAndTime";

export default () => {
    const [actsData, setData] = useState({
        isLoading: false,
        error: null,
        acts: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1)

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        actId: null
    });

    const handleChangePage = (event, value) => {
        setPageNumber(value - 1);
    };

    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('/api/write_off_acts?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(actsPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    acts: actsPage.content
                }));
                setPageCount(actsPage.totalPages);
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber]);

    const {isLoading, error, acts} = actsData;

    return (
        <div>
            {isLoading && 'Loading....'}
            {!isLoading && !error &&
            (acts.length != 0
                ? <TableContainer component={Paper}>
                    <Table size="small"
                           aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Identifier</TableCell>
                                <TableCell>Date and Time</TableCell>
                                <TableCell>Total amount of products</TableCell>
                                <TableCell>Total price of products</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {acts.map(act => <Acts act={act} key={act.id}/>)}
                        </TableBody>
                    </Table>
                </TableContainer>
                : 'Empty list')}
            <Pagination count={pageCount}
                        showFirstButton
                        showLastButton
                        page={pageNumber + 1}
                        onChange={handleChangePage}/>

            <Button variant="contained"
                    onClick={() => setDisplayCreateModal(true)}>
                Add write-off act</Button>
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <ActCreateModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <ActEditModal actId={displayEditModal.actId}
                                                            onCloseModal={() => setDisplayEditModal({
                                                                displayModal: false,
                                                                actId: null
                                                            })}
            />}
        </div>
    );

    function Acts({act}) {
        return (
            <TableRow>
                <TableCell>
                    <a href="#" onClick={() => setDisplayEditModal({
                        displayModal: true,
                        actId: act.id
                    })}>{act.writeOffActNumber}</a>
                </TableCell>
                <TableCell>{editToLocalTimeAndGet(act.actDateTime)}</TableCell>
                <TableCell>{act.totalProductAmount}</TableCell>
                <TableCell>{act.totalProductSum}</TableCell>
            </TableRow>
        )
    }
}

