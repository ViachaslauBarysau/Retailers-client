import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../Button';
import {AuthContext} from "../../../context/authContext";

const LocationProductEditModal = (props) => {
    const {logout} = useContext(AuthContext);
    let [locationProduct, setProduct] = useState(null);

    useEffect(() => {
        fetch('/api/location_products/' + props.locProductId, {
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
            .then(locationProduct => {
                setProduct(locationProduct);
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            })
    }, []);

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
                        <Button my={1} fullWidth={false}
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