import SupplierModal from './modal/SupplierCreateModal';
import React, {useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import SupplierEditModal from "./modal/SupplierEditModal";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Pagination from "@material-ui/lab/Pagination";

export default () => {
    const [suppliersData, setData] = useState({
        isLoading: false,
        error: null,
        suppliers: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1)

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        supplierId: null
    });

    const [selectedSuppliersNumber, setSelectedSuppliersNumber] = useState(0);

    function handleChange(e) {
        if (e.target.checked) {
            setSelectedSuppliersNumber(selectedSuppliersNumber + 1);
        } else {
            setSelectedSuppliersNumber(selectedSuppliersNumber - 1);
        }
    }

    const handleChangePage = (event, value) => {
        setPageNumber(value - 1);
    };

    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('/api/suppliers', {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(suppliersPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    suppliers: suppliersPage.content
                }));
                setPageCount(suppliersPage.totalPages);
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [suppliersData.displayModal]);

    const {isLoading, error, suppliers} = suppliersData;

    console.log(suppliers)

    return (
        <div>
            {isLoading && <LinearProgress/>}
            {!isLoading && !error &&
            <form onSubmit={changeSupplierStatus}>
                {(suppliers.length != 0
                    ? <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Full name</TableCell>
                                    <TableCell>Identifier</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {suppliers.map(supplier => <Supplier supplier={supplier}
                                                                     key={supplier.id}
                                                                     onChange={handleChange}
                                                                     onClick={() => setDisplayEditModal({
                                                                         displayModal: true,
                                                                         supplierId: supplier.id
                                                                     })}
                                />)}
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
                        onClick={() => setDisplayCreateModal(true)}>Add supplier</Button>
                <Button variant="contained"
                        type="submit"
                        disabled={selectedSuppliersNumber === 0}>Enable/Disable</Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <SupplierModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <SupplierEditModal userId={displayEditModal.supplierId}
                                                                 onCloseModal={() => setDisplayEditModal({
                                                                     displayModal: false,
                                                                     supplierId: null
                                                                 })}
            />}
        </div>
    );
}

function changeSupplierStatus(e) {
    e.preventDefault();
    let supplierIdList = [];
    e.target.suppliers.forEach(element => {
        element.checked && supplierIdList.push(element.value);
    });
    fetch('/api/suppliers', {
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(supplierIdList),
        method: "DELETE"
    });
}

function Supplier(props) {
    return (
        <TableRow key={props.supplier.id}>
            <TableCell component="th" scope="row">
                <input type="checkbox"
                       value={props.supplier.id}
                       name={"suppliers"}
                       onChange={props.onChange}/>
            </TableCell>
            <TableCell><a href="#" onClick={props.onClick}>{props.supplier.fullName}</a></TableCell>
            <TableCell>{props.supplier.identifier}</TableCell>
        </TableRow>
    )
}