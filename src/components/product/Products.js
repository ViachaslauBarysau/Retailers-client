import ProductCreateModal from './ProductCreateModal';
import ProductEditModal from './ProductEditModal';
import React, {useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import SupplierAppEditModal from "../application/supplier/modal/SupplierAppEditModal";

export default () => {
    const [productsData, setData] = useState({
        isLoading: true,
        error: null,
        products: [],
        displayModal: false,
    });

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        productId: null
    });

    useEffect(() => {
        fetch('http://localhost:8080/api/products', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(products => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    products
                }));
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [productsData.displayModal]);

    const {isLoading, error, products, displayModal} = productsData;

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
        <>
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
                                    <TableCell>Label date</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Units</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map(product => <Products product={product} key={product.id}/>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : 'Empty list')}
                <Button variant="contained" onClick={() => setData((prevState) => ({
                    ...prevState,
                    displayModal: true
                }))}>
                    Add product
                </Button>
                <Button variant="contained" type="submit">
                    Remove product
                </Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <ProductCreateModal onClick={() => setDisplayCreateModal(true)}/>}
            {displayEditModal.displayModal && <ProductEditModal productId={displayEditModal.productId}
                                                                    onCloseModal={() => setDisplayEditModal({
                                                                        displayModal: false,
                                                                        productId: null
                                                                    })}
            />}
        </>
    );

    function Products({product}) {
        return (
            <TableRow key={product.id}>
                <TableCell component="th" scope="row">
                    <input type="checkbox" value={product.id} name={"products"}/>
                </TableCell>
                <TableCell><a href="#" onClick={() => setDisplayEditModal({
                    displayModal: true,
                    productId: product.id
                })}>{product.upc}</a>
                </TableCell>
                <TableCell>{product.label}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.volume}</TableCell>
            </TableRow>
        )
    }
}
