import '../../Modal.css';
import React, {useEffect, useState} from 'react';
import {Button, TextField} from '@material-ui/core';

const LocationProductEditModal = (props) => {

    let [locationProduct, setProduct] = useState(null);

    useEffect(() => {
        fetch('/api/location_products/' + props.locProductId, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(locationProduct => {
                setProduct(locationProduct);
            });
    }, []);

    console.log(locationProduct)

    return (
        <div>
            {locationProduct &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={locationProduct.product.upc}
                                   variant="outlined"
                                   label="UPC"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={locationProduct.product.label}
                                   variant="outlined"
                                   label="Label"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={locationProduct.amount}
                                   variant="outlined"
                                   label="Amount"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={locationProduct.cost}
                                   variant="outlined"
                                   label="Cost"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={locationProduct.product.volume}
                                   variant="outlined"
                                   label="Item volume"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   value={locationProduct.product.volume * locationProduct.amount}
                                   variant="outlined"
                                   label="Total units number"
                                   disabled/>
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

export default LocationProductEditModal;