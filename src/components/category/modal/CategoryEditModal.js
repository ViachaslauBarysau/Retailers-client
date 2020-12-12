import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';

import {TextField} from '@material-ui/core';
import Button from '../../Button';
import {AuthContext} from "../../../context/authContext";
import {validateCustomerCreation} from "../../../validation/CustomerValidator";
import {validateCategoryEditing} from "../../../validation/CategoryValidator";

const CategoryEditModal = (props) => {
    const {logout} = useContext(AuthContext);
    const [category, setCategory] = useState(null);
    const [validationResults, setValidationResults] = useState(["errors"]);

    function handleNameChange(e) {
        setCategory({
            ...category,
            name: e.target.value
        })
    }

    function handleTaxChange(e) {
        setCategory({
            ...category,
            categoryTax: Number(e.target.value).toFixed(2) / 1
        })
    }

    useEffect(() => {
        fetch('/api/categories/' + props.categoryId, {
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
            .then(category => {
                setCategory(category)
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            })
    }, []);

    function editCategory(e) {
        e.preventDefault(e);
        setValidationResults(validateCategoryEditing(category))
        if (validationResults.length === 0) {
            fetch('/api/categories', {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(category),
                method: "PUT"
            })
                .then(res => {
                    switch (res.status) {
                        case 200:
                            props.handleOpenSnackBar("Category updated!", "success");
                            props.onCloseModal();
                            props.needrefresh();
                            break;
                        case 401:
                            logout();
                            break;
                        case 451:
                            props.handleOpenSnackBar("Name should be unique!", "warning");
                            break;
                    }
                })
                .catch(e => {
                    props.handleOpenSnackBar("Error happens!", "error");
                });
        }
    }

    return (
        <div>
            {category &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={editCategory}>
                        <TextField size="small"
                                   fullWidth={true}
                                   name="categoryName"
                                   variant="outlined"
                                   onChange={handleNameChange}
                                   label="Category name"
                                   error={validationResults.includes("name")}
                                   helperText={validationResults.includes("name") ? "Name length must be between 3 and 30 characters!" : " "}
                                   value={category.name}/>
                        <TextField margin="dense"
                                   type="number"
                                   size="small"
                                   fullWidth={true}
                                   name="tax"
                                   variant="outlined"
                                   value={category.categoryTax}
                                   label="Category tax"
                                   error={validationResults.includes("tax")}
                                   helperText={validationResults.includes("tax") ? "Min tax is 0!" : " "}
                                   onChange={handleTaxChange}
                                   InputProps={{
                                       inputProps: {
                                           step: 0.01
                                       }
                                   }}/>
                        <br/>
                        <Button my={1} type="submit"
                                variant="contained">Edit category</Button>
                        <Button m={1} id="closeButton"
                                onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>
            }

        </div>
    )
};

export default CategoryEditModal;
