import '../../Modal.css';
import ReactDom from 'react-dom';
import React, {useState, useEffect} from 'react';
import {FormControl, TextField, Button} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const ProductCreateModal = (props) => {

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
        fetch('/api/products', {
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
        props.onCloseModal();
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
                                   label="UPC"
                                   required/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   id="label"
                                   variant="outlined"
                                   label="Label"
                                   required/>
                        <Autocomplete
                            id="category"
                            size="small"
                            freeSolo
                            options={categories.map((option) => option.name)}
                            renderInput={(params) => (
                                <TextField fullWidth={true}
                                           {...params}
                                           label="Category"
                                           margin="normal"
                                           variant="outlined"
                                           required/>
                            )}
                        />
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   id="units"
                                   variant="outlined"
                                   label="Units"
                                   required/>
                        <br/>
                        <Button fullWidth={false}
                                type="submit"
                                variant="contained">Add product</Button>
                        <Button fullWidth={false}
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
