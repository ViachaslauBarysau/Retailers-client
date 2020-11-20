import './UpperModal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import ProductsSelect from '../formSelects/ProductsSelect';
import { TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';


const UpperProductModal = (props) => {

    const [productsData, setData] = useState({
        products: [],
    });

    useEffect(() => {
        fetch('http://localhost:8080/products?size=100000', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(products => {
                setData((prevState) => ({
                    ...prevState,
                    products
                }));
            })
            
    }, []);

    const { products } = productsData;

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseUpperModal} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form>
                    <Autocomplete
                        id="products"
                        freeSolo
                        autoSelect
                        options={products.map((option) => option.label)}
                        renderInput={(params) => (
                            <TextField {...params} label="products" margin="normal" variant="outlined" />
                        )}
                    />
                    <TextField id="amount" variant="outlined" label="Amount" />
                    <TextField id="cost" variant="outlined" label="Cost" />
                    <br/>
                    <Button type="submit" variant="contained">Add product</Button>
                    <Button id="closeButton" type="button" onClick={props.onCloseUpperModal} variant="contained">Close</Button>
                </form>
            </div>
        </div>
    )
}

export default UpperProductModal;