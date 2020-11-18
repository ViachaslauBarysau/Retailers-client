import './UpperModal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import ProductsSelect from '../formSelects/ProductsSelect';


const UpperProductModal = (props) => {
    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseUpperModal} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form>
                    <label> Products:
                    <ProductsSelect />
                    </label>
                    <br />
                    <label> Amount:
                        <input type="text" id="amount" />
                    </label>
                    <br />
                    <label> Cost:
                        <input type="text" id="cost" />
                    </label>
                    <br />
                    <input type="submit" value="Add product" />
                    <input type="button" onClick={props.onCloseUpperModal} value="Close" />
                </form>
            </div>
        </div>
    )
}

export default UpperProductModal;