
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

export default () => {
    const [productsData, setData] = useState({
        isLoading: true,
        error: null,
        loc_products: [],
    });

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        loc_productId: null
    });

    useEffect(() => {
        fetch('http://localhost:8080/api/location_products', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(loc_products => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    loc_products
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

    const { isLoading, error, loc_products } = productsData;

    console.log(productsData)

    return (
        <div>
            {isLoading && 'Loading....'}
            {!isLoading && !error &&
            <form>
                {(productsData.loc_products.length !== 0
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
                                {productsData.loc_products.map(loc_product => <LocationProducts loc_product={loc_product} key={loc_product.id}/>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : 'Empty list')}
                <Button variant="contained" onClick={() => setDisplayCreateModal(true)}>
                    Create write-off act
                </Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <ActCreateModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <LocationProductEditModal loc_productId={displayEditModal.loc_productId}
                                                                onCloseModal={() => setDisplayEditModal({
                                                                    displayModal: false,
                                                                    loc_productId: null
                                                                })}
            />}
            {/*{displayEditModal.displayModal && <ActCreateModal productId={displayEditModal.productId}*/}
            {/*                                                  onCloseModal={() => setDisplayEditModal({*/}
            {/*                                                      displayModal: false,*/}
            {/*                                                      productId: null*/}
            {/*                                                  })}*/}
            {/*/>}*/}
        </div>
    );

    function LocationProducts({loc_product}) {
        return (
            <TableRow key={loc_product.id}>
                <TableCell><a href="#" onClick={() => setDisplayEditModal({
                    displayModal: true,
                    loc_productId: loc_product.id
                })}>{loc_product.product.upc}</a>
                </TableCell>
                <TableCell>{loc_product.product.label}</TableCell>
                <TableCell>{loc_product.product.category.name}</TableCell>
                <TableCell>{loc_product.product.volume}</TableCell>
            </TableRow>
        )
    }
}
