import ProductCreateModal from './modal/ProductCreateModal';
import ProductEditModal from './modal/ProductEditModal';
import React, {useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Pagination from '@material-ui/lab/Pagination';

export default () => {
    const [productsData, setData] = useState({
        isLoading: true,
        error: null,
        products: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, stPageCount] = useState(1)

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        productId: null
    });

    const [selectedProductsNumber, setSelectedProductsNumber] = useState(0);

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
        fetch('http://localhost:8080/api/products?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(productsPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    products: productsPage.content
                }));
                stPageCount(productsPage.totalPages);
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber]);

    const {isLoading, error, products} = productsData;

    function removeProducts(e) {
        e.preventDefault();
        let productIdList = [];
        e.target.products.forEach(element => {
            element.checked && productIdList.push({id: element.value});
        });
        fetch('http://localhost:8080/api/products', {
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
            .then(() => {

            });
    }

    return (
        <div>
            {isLoading && 'Loading....'}
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
                <Pagination count={pageCount} showFirstButton showLastButton page={pageNumber + 1}
                            onChange={handleChangePage}/>
                <Button variant="contained" onClick={() => setDisplayCreateModal(true)}>
                    Add product
                </Button>
                <Button variant="contained" type="submit" disabled={selectedProductsNumber === 0}>
                    Remove product
                </Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <ProductCreateModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <ProductEditModal productId={displayEditModal.productId}
                                                                    onCloseModal={() => setDisplayEditModal({
                                                                        displayModal: false,
                                                                        productId: null
                                                                    })}
            />}
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
