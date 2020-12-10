import ProductCreateModal from './modal/ProductCreateModal';
import ProductEditModal from './modal/ProductEditModal';
import React, {useContext, useEffect, useState} from 'react';
import Button from '../Button';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Pagination from '@material-ui/lab/Pagination';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {AuthContext} from "../../context/authContext";
import TablePagination from "@material-ui/core/TablePagination";
import {StyledTableCell, StyledTableRow} from "../Table";

export default () => {
    const {logout} = useContext(AuthContext);
    const [productsData, setData] = useState({
        isLoading: false,
        error: null,
        products: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [needRefresh, setNeedRefresh] = useState(false);

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        productId: null
    });

    const [selectedProductsNumber, setSelectedProductsNumber] = useState(0);

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
            setSelectedProductsNumber(selectedProductsNumber + 1);
        } else {
            setSelectedProductsNumber(selectedProductsNumber - 1);
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
        fetch('/api/products?page=' + pageNumber + '&size=' + elementsOnPage, {
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
            .then(productsPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    products: productsPage.content
                }));
                setTotalElements(productsPage.totalElements)
                if (pageNumber > productsPage.totalPages - 1) {
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

    const {isLoading, error, products} = productsData;

    function removeProducts(e) {
        e.preventDefault();
        let productIdList = [];
        if (e.target.products.length === undefined) {
            e.target.products.checked && productIdList.push(Number(e.target.products.value));
        } else {
            e.target.products.forEach(element => {
                element.checked && productIdList.push(element.value);
            });
        }
        fetch('/api/products', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(
                productIdList
            ),
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .then(undeletedProducts => {
                if (undeletedProducts.length != 0) {
                    handleOpenSnackBar("Some products haven't been deleted because " +
                        "they are used in open applications or stored in customer's locations.", "warning");
                } else {
                    handleOpenSnackBar("Deleted successfully!", "success");
                }
                setNeedRefresh(!needRefresh);
                setData((prevState) => ({...prevState, products: []}))
            })
            .catch(e => {
                handleOpenSnackBar("Error happens!", "error");
            });
    }

    return (
        <div>
            {isLoading && <LinearProgress/>}
            {!isLoading && !error &&
            <form onSubmit={removeProducts}>
                {(products.length !== 0
                    ? <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left" width={10}></StyledTableCell>
                                    <StyledTableCell>UPC</StyledTableCell>
                                    <StyledTableCell>Label</StyledTableCell>
                                    <StyledTableCell>Category</StyledTableCell>
                                    <StyledTableCell>Units</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map(product => <Product product={product}
                                                                  key={product.id}
                                                                  onChange={handleChange}
                                                                  onClick={() => setDisplayEditModal({
                                                                      displayModal: true,
                                                                      productId: product.id
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
                    : 'Empty list')}
                <Button my={1} variant="contained"
                        onClick={() => setDisplayCreateModal(true)}>Add product</Button>
                <Button m={1} variant="contained"
                        type="submit"
                        disabled={selectedProductsNumber === 0}>Remove product</Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <ProductCreateModal handleOpenSnackBar={(message, severity) =>
                handleOpenSnackBar(message, severity)}
                                                       needrefresh={() => setNeedRefresh(!needRefresh)}
                                                       onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <ProductEditModal productId={displayEditModal.productId}
                                                                handleOpenSnackBar={(message, severity) =>
                                                                    handleOpenSnackBar(message, severity)}
                                                                needrefresh={() => setNeedRefresh(!needRefresh)}
                                                                onCloseModal={() => setDisplayEditModal({
                                                                    displayModal: false,
                                                                    productId: null
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

function Product(props) {
    return (
        <StyledTableRow align="left" key={props.product.id}>
            <StyledTableCell component="th" scope="row">
                <input type="checkbox"
                       value={props.product.id}
                       name={"products"}
                       onChange={props.onChange}/>
            </StyledTableCell>
            <StyledTableCell align="left"><a href="#" onClick={props.onClick}>{props.product.upc}</a>
            </StyledTableCell>
            <StyledTableCell align="left">{props.product.label}</StyledTableCell>
            <StyledTableCell align="left">{props.product.category.name}</StyledTableCell>
            <StyledTableCell align="left">{props.product.volume}</StyledTableCell>
        </StyledTableRow>
    )
}
