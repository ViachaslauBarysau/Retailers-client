import './Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';

const ProductModal = (props) => {
  return (
      <div className={"modal-wrapper"}>
        <div onClick={props.onClick} className={"modal-backdrop"} />
        <div className={"modal-box"}>
          <form>
            <label> UPC:
              <input type="text" name="upc" />
            </label>
            <br/>
            <label> Label:
              <input type="text" name="label" />
            </label>
            <br/>
            <label> Category:
              <input type="text" name="category" />
            </label>
            <br/>
            <label> Units:
              <input type="text" name="units" />
            </label>
            <br/>
            <input type="submit" value="Add product" />
            <input type="button" onClick={props.onClick} value="Close" />
          </form>
        </div>
      </div>
  )
}

export default ProductModal;
