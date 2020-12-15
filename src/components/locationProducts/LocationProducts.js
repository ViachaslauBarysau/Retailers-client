import React, {useContext, useEffect, useState} from 'react';
import Button from '../Button';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import ActCreateModal from "../act/modal/ActCreateModal";
import LocationProductEditModal from "./modal/LocationProductEditModal";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import TablePagination from "@material-ui/core/TablePagination";
import {StyledTableCell, StyledTableRow} from "../Table";
import {AuthContext} from "../../context/authContext";
import Typography from "@material-ui/core/Typography";

export default () => {
    const {logout} = useContext(AuthContext);
    const [productsData, setData] = useState({
        isLoading: false,
        error: null,
        locProducts: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        locProductId: null
    });

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

    const handleChangeRowsPerPage = (event) => {
        setElementsOnPage(+event.target.value);
        setPageNumber(0);
    };

    const handleChangePage = (event, newPage) => {
        setPageNumber(newPage);
    };

    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('/api/location_products?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                'Authorization': localStorage.getItem("token"),
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
            .then(locProductsPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    locProducts: locProductsPage.content
                }));
                setTotalElements(locProductsPage.totalElements)
                if (pageNumber > locProductsPage.totalPages - 1 && pageNumber !== 0) {
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

    const {isLoading, error, locProducts} = productsData;

    return (
        <div>
            {isLoading && <LinearProgress/>}
            {!isLoading && !error &&
            <div>
                {(locProducts.length !== 0
                    ? <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>UPC</StyledTableCell>
                                    <StyledTableCell>Label</StyledTableCell>
                                    <StyledTableCell>Category</StyledTableCell>
                                    <StyledTableCell>Units</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsData.locProducts.map(locProduct => <LocationProducts locProduct={locProduct}
                                                                                              key={locProduct.id}/>)}
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
                        onClick={() => setDisplayCreateModal(true)}> Add write-off act</Button>
            </div>
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
            {displayCreateModal && <ActCreateModal handleOpenSnackBar={(message, severity) =>
                handleOpenSnackBar(message, severity)}
                                                   onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <LocationProductEditModal locProductId={displayEditModal.locProductId}
                                                                        onCloseModal={() => setDisplayEditModal({
                                                                            displayModal: false,
                                                                            locProductId: null
                                                                        })}
            />}
        </div>
    );

    function LocationProducts({locProduct}) {
        return (
            <StyledTableRow key={locProduct.id}>
                <StyledTableCell><a href="#" onClick={() => setDisplayEditModal({
                    displayModal: true,
                    locProductId: locProduct.id
                })}>{locProduct.product.upc}</a>
                </StyledTableCell>
                <StyledTableCell>{locProduct.product.label}</StyledTableCell>
                <StyledTableCell>{locProduct.product.category.name}</StyledTableCell>
                <StyledTableCell>{locProduct.product.volume}</StyledTableCell>
            </StyledTableRow>
        )
    }
}
