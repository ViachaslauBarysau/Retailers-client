import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {AuthContext} from "../../../context/authContext";
import {validateProductCreation} from "../../../validation/ProductValidator";

const ProductCreateModal = (props) => {
    const {user, logout} = useContext(AuthContext);
    const [validationResults, setValidationResults] = useState(["errors"]);
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        fetch('/api/categories?size=100000', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(categories => {
                setCategories(categories.content);
            })
    }, []);

    function addProduct(e) {
        e.preventDefault();
        let validResults = validateProductCreation(e);
        if (validResults.length === 0) {
            fetch('/api/products', {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    upc: e.target.upc.value,
                    label: e.target.label.value,
                    volume: e.target.units.value,
                    category: {
                        name: e.target.category.value,
                    },
                    customer: user.customer,
                    status: "ACTIVE"
                }),
                method: "POST"
            })
                .then(res => {
                    switch (res.status) {
                        case 201:
                            props.handleOpenSnackBar("Product created!", "success");
                            props.onCloseModal();
                            props.needrefresh();
                            break;
                        case 401:
                            logout();
                            break;
                        case 451:
                            props.handleOpenSnackBar("UPC should be unique!", "warning");
                            break;
                    }
                })
                .catch(e => {
                    props.handleOpenSnackBar("Error happens!", "error");
                });
        }
        setValidationResults(validResults);
    }

    return (
        <div>
            {categories &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={addProduct}>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   id="upc"
                                   variant="outlined"
                                   error={validationResults.includes("upc")}
                                   helperText={validationResults.includes("upc") ? "Incorrect UPC!" : ""}
                                   label="UPC"/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   id="label"
                                   variant="outlined"
                                   label="Label"
                                   error={validationResults.includes("label")}
                                   helperText={validationResults.includes("label") ?
                                       "Label length must be between 3 and 30 characters!" : ""}
                        />
                        <Autocomplete
                            id="category"
                            margin="dense"
                            size="small"
                            freeSolo
                            options={categories.map((option) => option.name)}
                            renderInput={(params) => (
                                <TextField fullWidth={true}
                                           {...params}
                                           label="Category"
                                           margin="normal"
                                           variant="outlined"
                                           error={validationResults.includes("categoryName")}
                                           helperText={validationResults.includes("categoryName") ?
                                               "Category name length must be between 3 and 30 characters!" : ""}
                                />
                            )}
                        />
                        <TextField margin="dense"
                                   size="small"
                                   type="number"
                                   fullWidth={true}
                                   id="units"
                                   variant="outlined"
                                   label="Units"
                                   error={validationResults.includes("volume")}
                                   helperText={validationResults.includes("volume") ?
                                       "Volume must be greater than 0!" : ""}
                        />
                        <Button my={1} fullWidth={false}
                                type="submit"
                                variant="contained">Add product</Button>
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

export default ProductCreateModal;
