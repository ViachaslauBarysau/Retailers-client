import SupplierCreateModal from './modal/SupplierCreateModal';
import React, {useContext, useEffect, useState} from 'react';
import Button from '../Button';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import SupplierWarehouseEditModal from "./modal/SupplierWarehouseEditModal";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import TablePagination from "@material-ui/core/TablePagination";
import {StyledTableCell, StyledTableRow} from "../Table";
import {AuthContext} from "../../context/authContext";
import SupplierEditModal from "./modal/SupplierEditModal";
import Typography from "@material-ui/core/Typography";

export default () => {
    const {logout} = useContext(AuthContext);
    const [suppliersData, setData] = useState({
        isLoading: false,
        error: null,
        suppliers: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [needRefresh, setNeedRefresh] = useState(false);

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        supplierId: null
    });

    const [selectedSuppliersNumber, setSelectedSuppliersNumber] = useState(0);

    const [snackBar, setSnackBar] = useState({
        display: false,
        message: "",
        severity: "success"
    });

    const handleOpenSnackBar = (message, severity) => {
        setSnackBar({
            display: true,
            message,
            severity
        });
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({
            display: false,
            message: ""
        });
    };

    function handleChange(e) {
        if (e.target.checked) {
            setSelectedSuppliersNumber(selectedSuppliersNumber + 1);
        } else {
            setSelectedSuppliersNumber(selectedSuppliersNumber - 1);
        }
    }

    const handleChangeRowsPerPage = (event) => {
        setElementsOnPage(+event.target.value);
        setPageNumber(0);
    };

    const handleChangePage = (event, newPage) => {
        setPageNumber(newPage);
    };

    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('/api/suppliers?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .then(suppliersPage => {
                debugger;
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    suppliers: suppliersPage.content
                }));
                setTotalElements(suppliersPage.totalElements)
                if (pageNumber > suppliersPage.totalPages === 0 && suppliersPage.totalPages - 1) {
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
    }, [pageNumber, needRefresh, elementsOnPage]);

    function changeSupplierStatus(e) {
        e.preventDefault();
        let supplierIdList = [];
        if (e.target.suppliers.length === undefined) {
            e.target.suppliers.checked && supplierIdList.push(Number(e.target.suppliers.value));
        } else {
            e.target.suppliers.forEach(element => {
                element.checked && supplierIdList.push(element.value);
            });
        }
        fetch('/api/suppliers', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(supplierIdList),
            method: "DELETE"
        })
            .then(res => {
                if (res.status == 201) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .then(() => {
                handleOpenSnackBar("Completed successfully!", "success");
                setNeedRefresh(!needRefresh);
                setData((prevState) => ({...prevState, suppliers: []}))
            })
            .catch(e => {
                handleOpenSnackBar("Error happens!", "error");
            });
    }

    const {isLoading, error, suppliers} = suppliersData;

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
                                    <StyledTableCell width={10}></StyledTableCell>
                                    <StyledTableCell>Full name</StyledTableCell>
                                    <StyledTableCell>Identifier</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
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
                    : <Typography
                        style={{
                            textAlign: 'center',
                            margin: '10px'
                        }}
                        variant='h6'
                    >
                        No records.
                    </Typography>)}
                <Button my={1} variant="contained"
                        onClick={() => setDisplayCreateModal(true)}>Add supplier</Button>
                <Button m={1} variant="contained"
                        type="submit"
                        disabled={selectedSuppliersNumber === 0}>Enable/Disable</Button>
            </form>
            }
            {!isLoading && error && <Typography
                style={{
                    textAlign: 'center',
                    margin: '10px'
                }}
                variant='h6'
            >
                Error happens.
            </Typography>}
            {displayCreateModal && <SupplierCreateModal handleOpenSnackBar={(message, severity) =>
                                                            handleOpenSnackBar(message, severity)}
                                                        needrefresh={() => setNeedRefresh(!needRefresh)}
                                                        onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <SupplierEditModal supplierId={displayEditModal.supplierId}
                                                                          handleOpenSnackBar={(message, severity) =>
                                                                              handleOpenSnackBar(message, severity)}
                                                                          needrefresh={() => setNeedRefresh(!needRefresh)}
                                                                          onCloseModal={() => setDisplayEditModal({
                                                                              displayModal: false,
                                                                              supplierId: null
                                                                          })}
            />}
            <Snackbar open={snackBar.display} autoHideDuration={6000} onClose={handleCloseSnackBar}>
                <Alert onClose={handleCloseSnackBar} severity={snackBar.severity}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

function Supplier(props) {
    return (
        <StyledTableRow key={props.supplier.id}>
            <StyledTableCell component="th" scope="row">
                <input type="checkbox"
                       value={props.supplier.id}
                       name={"suppliers"}
                       onChange={props.onChange}/>
            </StyledTableCell>
            <StyledTableCell><a href="#" onClick={props.onClick}>{props.supplier.fullName}</a></StyledTableCell>
            <StyledTableCell>{props.supplier.identifier}</StyledTableCell>
            <StyledTableCell>{props.supplier.supplierStatus}</StyledTableCell>
        </StyledTableRow>
    )
}