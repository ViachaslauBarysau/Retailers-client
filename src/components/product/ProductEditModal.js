import '../../modals/Modal.css';
import React, {useEffect, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const ProductEditModal = (props) => {

    let [product, setProduct] = useState(null);

    let [categories, setCategories] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/products/' + props.productId, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(product => {
                setProduct(product);
            });
        fetch('http://localhost:8080/api/categories?size=100000', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(categories => {
                setCategories(categories);
            })
    }, []);

    function editProduct(e) {
        e.preventDefault();
        fetch('http://localhost:8080/api/products', {
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id: product.id,
                upc: product.upc,
                label: e.target.label.value,
                volume: product.volume,
                category: {
                    name: e.target.category.value,
                },
                customer: {
                    id: JSON.parse(localStorage.getItem("user")).customer.id
                },
                status: "ACTIVE"
            }),
            method: "PUT"
        });
        e.target.closeButton.click();
    }

    let handleChange = (e) => setProduct(
        (prevState) => {
            return (
                {...prevState, label: e.target.value}
            )
        })

    return (
        <div>
            {product && categories &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={editProduct}>
                        <TextField margin="dense" size="small" fullWidth={true} value={product.upc}
                                   id="upc" variant="outlined" label="UPC" disabled/>
                        <TextField margin="dense" size="small" fullWidth={true} value={product.label}
                                   id="label" variant="outlined" label="Label"
                                   onChange={handleChange}
                                   required/>
                        <Autocomplete
                            id="category"
                            size="small"
                            freeSolo
                            defaultValue={product.category.name}
                            options={categories.map((option) => option.name)}
                            renderInput={(params) => (
                                <TextField fullWidth={true} {...params} label="Category" margin="normal"
                                           variant="outlined" required/>
                            )}
                        />
                        <TextField margin="dense" size="small" fullWidth={true} value={product.volume}
                                   id="units" variant="outlined" label="Units" disabled/>
                        <Button fullWidth={false} type="submit" variant="contained">Edit product</Button>
                        <Button fullWidth={false} id="closeButton" type="button" onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>
    )
}

export default ProductEditModal;
