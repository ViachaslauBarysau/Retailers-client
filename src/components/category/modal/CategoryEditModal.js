import '../../Modal.css';
import React, {useEffect, useState} from 'react';

import {Button, TextField} from '@material-ui/core';

const CategoryEditModal = (props) => {

    const [category, setCategory] = useState(null);

    function handleNameChange(e) {
        setCategory({
            ...category,
            name: e.target.value
        })
    }

    function handleTaxChange(e) {
        console.log(e.target.value)
        setCategory({
            ...category,
            categoryTax: e.target.value
        })
    }

    useEffect(() => {
        fetch('/api/categories/' + props.categoryId, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(bill => {
                setCategory(bill)
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
        });
        props.onCloseModal();
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
