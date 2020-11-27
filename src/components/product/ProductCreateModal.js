import '../../modals/Modal.css';
import ReactDom from 'react-dom';
import React, {useState, useEffect} from 'react';
import {FormControl, TextField, Button} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const ProductCreateModal = (props) => {

    const [categories, setCategories] = useState(null);

    useEffect(() => {
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

    return (
        <div>
            {categories &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onClick} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={addProduct}>
                        <TextField margin="dense" size="small" fullWidth={true} id="upc" variant="outlined" label="UPC"
                                   required/>
                        <TextField margin="dense" size="small" fullWidth={true} id="label" variant="outlined"
                                   label="Label"
                                   required/>
                        <Autocomplete
                            id="category"
                            size="small"
                            freeSolo
                            options={categories.map((option) => option.name)}
                            renderInput={(params) => (
                                <TextField fullWidth={true} {...params} label="Category" margin="normal"
                                           variant="outlined"
                                           required/>
                            )}
                        />
                        <TextField margin="dense" size="small" fullWidth={true} id="units" variant="outlined"
                                   label="Units"
                                   required/>
                        <br/>
                        <Button fullWidth={false} type="submit" variant="contained">Add product</Button>
                        <Button fullWidth={false} id="closeButton" type="button" onClick={props.onClick}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>
            }
        </div>
    )
}

function addProduct(e) {
    e.preventDefault();
    fetch('http://localhost:8080/api/products', {
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            upc: Number(e.target.upc.value),
            label: e.target.label.value,
            volume: e.target.units.value,
            category: {
                name: e.target.category.value,
            },
            customer: {
                id: JSON.parse(localStorage.getItem("user")).customer.id
            },
            status: "ACTIVE"
        }),
        method: "POST"
    });
    e.target.closeButton.click();
}

export default ProductCreateModal;
