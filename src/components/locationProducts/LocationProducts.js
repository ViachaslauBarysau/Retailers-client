
import React, {useEffect, useState} from 'react';
import {Button} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import ActCreateModal from "../act/modal/ActCreateModal";
import LocationProductEditModal from "./modal/LocationProductEditModal";
import Pagination from "@material-ui/lab/Pagination";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

export default () => {
    const [productsData, setData] = useState({
        isLoading: true,
        error: null,
        locProducts: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1)

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        locProductId: null
    });

    const handleChangePage = (event, value) => {
        setPageNumber(value - 1);
    };

    useEffect(() => {
        fetch('http://localhost:8080/api/location_products?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(locProductsPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    locProducts: locProductsPage.content
                }));
                setPageCount(locProductsPage.totalPages);
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber]);

    const { isLoading, error, locProducts } = productsData;

    console.log(productsData)

    return (
        <div>
            {isLoading && <LinearProgress  />}
            {!isLoading && !error &&
            <form>
                {(locProducts.length !== 0
                    ? <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>UPC</TableCell>
                                    <TableCell>Label</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Units</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsData.locProducts.map(locProduct => <LocationProducts locProduct={locProduct} key={locProduct.id}/>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : 'Empty list')}
                <Pagination count={pageCount} showFirstButton showLastButton page={pageNumber + 1}
                            onChange={handleChangePage}/>
                <Button variant="contained" onClick={() => setDisplayCreateModal(true)}>
                    Create write-off act
                </Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <ActCreateModal onCloseModal={() => setDisplayCreateModal(false)}/>}
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
            <TableRow key={locProduct.id}>
                <TableCell><a href="#" onClick={() => setDisplayEditModal({
                    displayModal: true,
                    locProductId: locProduct.id
                })}>{locProduct.product.upc}</a>
                </TableCell>
                <TableCell>{locProduct.product.label}</TableCell>
                <TableCell>{locProduct.product.category.name}</TableCell>
                <TableCell>{locProduct.product.volume}</TableCell>
            </TableRow>
        )
    }
}
