import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {AuthContext} from "../../../context/authContext";
import {validateProductEditing} from "../../../validation/ProductValidator";

const ProductEditModal = (props) => {
    const {logout} = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState(null);
    const [validationResults, setValidationResults] = useState(["errors"]);

    let handleCategoryChange = (value) => setProduct(
        (prevState) => {
            return (
                {
                    ...prevState,
                    category: {
                        name: value,
                    },
                }
            )
        });

    let handleLabelChange = (e) => setProduct(
        (prevState) => {
            return (
                {...prevState, label: e.target.value}
            )
        });

    useEffect(() => {
        fetch('/api/products/' + props.productId, {
            headers: {
                "Authorization": localStorage.getItem("token")
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
            .then(product => {
                setProduct(product);
            });
        fetch('/api/categories?size=100000', {
            headers: {
                "Authorization": localStorage.getItem("token")
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
            .then(categories => {
                setCategories(categories.content);
            })
    }, []);

    function editProduct(e) {
        e.preventDefault();
        let validResults = validateProductEditing(product);
        if (validResults.length === 0) {
            fetch('/api/products', {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(product),
                method: "PUT"
            })
                .then(res => {
                    if (res.ok) {
                        props.handleOpenSnackBar("Product updated!", "success");
                        props.onCloseModal();
                        props.needrefresh();
                    } else if (res.status === 401) {
                        logout();
                    }
                    ;
                })
                .catch(e => {
                    props.handleOpenSnackBar("Error happens!", "error");
                });
        }
        setValidationResults(validResults);
    }

    return (
        <div>
            {product && categories &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={editProduct}>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={product.upc}
                                   id="upc"
                                   variant="outlined"
                                   label="UPC"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={product.label}
                                   id="label"
                                   variant="outlined"
                                   label="Label"
                                   onChange={handleLabelChange}
                                   error={validationResults.includes("label")}
                                   helperText={validationResults.includes("label") ?
                                       "Label length must be between 3 and 30 characters!" : ""}
                        />
                        <Autocomplete
                            id="category"
                            size="small"
                            freeSolo
                            defaultValue={product.category.name}
                            options={categories.map((option) => option.name)}
                            onChange={(e) => handleCategoryChange(e.target.innerText)}
                            renderInput={(params) => (
                                <TextField fullWidth={true}
                                           {...params}
                                           label="Category"
                                           margin="normal"
                                           variant="outlined"
                                           onKeyUp={(e) => handleCategoryChange(e.target.value)}
                                           error={validationResults.includes("categoryName")}
                                           helperText={validationResults.includes("categoryName") ?
                                               "Category name length must be between 3 and 30 characters!" : ""}
                                />
                            )}
                        />
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={product.volume}
                                   id="units"
                                   variant="outlined"
                                   label="Units"
                                   disabled/>
                        <Button my={1} fullWidth={false}
                                type="submit"
                                variant="contained">Edit product</Button>
                        <Button m={1} fullWidth={false}
                                id="closeButton"
                                type="button"
                                onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>
    )
}

export default ProductEditModal;
