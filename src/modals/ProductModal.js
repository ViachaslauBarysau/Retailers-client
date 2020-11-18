import './Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';

const ProductModal = (props) => {
  return (
    <div className={"modal-wrapper"}>
      <div onClick={props.onClick} className={"modal-backdrop"} />
      <div className={"modal-box"}>
        <form onSubmit={addProduct}>
          <label> UPC:
              <input type="text" id="upc" />
          </label>
          <br />
          <label> Label:
              <input type="text" id="label" />
          </label>
          <br />
          <label> Category:
              <input type="text" id="category" />
          </label>
          <br />
          <label> Units:
              <input type="text" id="units" />
          </label>
          <br />
          <input type="submit" value="Add product" />
          <input id="closeButton" type="button" onClick={props.onClick} value="Close" />
        </form>
      </div>
    </div>
  )
}

function addProduct(e) {
  e.preventDefault();
  fetch('http://localhost:8080/products', {
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
        categoryTax: 0,
        name: e.target.category.value,
        customer: {
          id: JSON.parse(localStorage.getItem("user")).customer.id
        }
      },
      customer: {
        id: JSON.parse(localStorage.getItem("user")).customer.id
      }
    }),
    method: "POST"
  });
  e.target.closeButton.click();
}

export default ProductModal;
