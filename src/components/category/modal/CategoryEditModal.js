import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';

import {Button, TextField} from '@material-ui/core';
import {AuthContext} from "../../../context/authContext";

const CategoryEditModal = (props) => {
    const {logout} = useContext(AuthContext);
    const [category, setCategory] = useState(null);

    function handleNameChange(e) {
        setCategory({
            ...category,
            name: e.target.value
        })
    }

    function handleTaxChange(e) {
        setCategory({
            ...category,
            categoryTax: Number(e.target.value).toFixed(2)/1
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
            });
    }, []);


    function editCategory(e) {
        e.preventDefault(e);
        console.log(category)
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
                                   value={category.name}
                                   required/>
                        <TextField margin="dense"
                                   type="number"
                                   size="small"
                                   fullWidth={true}
                                   name="tax"
                                   variant="outlined"
                                   value={category.categoryTax}
                                   label="Category tax"
                                   onChange={handleTaxChange}
                                   InputProps={{
                                       inputProps: {
                                           min: 0.01, step: 0.01
                                       }
                                   }}
                                   required/>
                        <br/>
                        <Button type="submit"
                                variant="contained">Edit category</Button>
                        <Button id="closeButton"
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
