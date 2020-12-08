import ProductCreateModal from './modal/ProductCreateModal';
import ProductEditModal from './modal/ProductEditModal';
import React, {useContext, useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
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

export default () => {
    const {logout} = useContext(AuthContext);
    const [productsData, setData] = useState({
        isLoading: false,
        error: null,
        products: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1)
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

    const handleChangePage = (event, value) => {
        setPageNumber(value - 1);
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
                setPageCount(productsPage.totalPages);
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber, needRefresh]);

    const {isLoading, error, products} = productsData;

    function removeProducts(e) {
        e.preventDefault();
        let productIdList = [];
        e.target.products.forEach(element => {
            element.checked && productIdList.push(element.value);
        });
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
                                    <TableCell></TableCell>
                                    <TableCell>UPC</TableCell>
                                    <TableCell>Label</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Units</TableCell>
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
                    </TableContainer>
                    : 'Empty list')}
                <Pagination count={pageCount}
                            showFirstButton
                            showLastButton
                            page={pageNumber + 1}
                            onChange={handleChangePage}/>
                <Button variant="contained"
                        onClick={() => setDisplayCreateModal(true)}>Add product</Button>
                <Button variant="contained"
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
        <TableRow key={props.product.id}>
            <TableCell component="th" scope="row">
                <input type="checkbox"
                       value={props.product.id}
                       name={"products"}
                       onChange={props.onChange}/>
            </TableCell>
            <TableCell><a href="#" onClick={props.onClick}>{props.product.upc}</a>
            </TableCell>
            <TableCell>{props.product.label}</TableCell>
            <TableCell>{props.product.category.name}</TableCell>
            <TableCell>{props.product.volume}</TableCell>
        </TableRow>
    )
}
