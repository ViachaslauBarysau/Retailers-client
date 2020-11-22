import '../../modals/Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import { FormControl, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const ProductModal = (props) => {

  const [categoriesData, setData] = useState({
    categories: [],
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/categories?size=100000', {
      headers: {
        "Authorization": localStorage.getItem("token")
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(categories => {
        setData((prevState) => ({
          ...prevState,
          categories
        }));
      })

  }, []);

  const { categories } = categoriesData;

  return ( 
    <div className={"modal-wrapper"}>
      <div onClick={props.onClick} className={"modal-backdrop"} />
      <div className={"modal-box"}>
        <form onSubmit={addProduct}>
          <TextField fullWidth={true} id="upc" variant="outlined" label="UPC" />
          <TextField fullWidth={true} id="label" variant="outlined" label="Label" />
          <Autocomplete
            id="category"
            freeSolo
            autoSelect
            options={categories.map((option) => option.name)}
            renderInput={(params) => (
              <TextField fullWidth={true} {...params} label="categories" margin="normal" variant="outlined" />
            )}
          />
          <TextField fullWidth={true} id="units" variant="outlined" label="Units" />
          <Button fullWidth={true} type="submit" variant="contained">Add product</Button>
          <Button fullWidth={true} id="closeButton" type="button" onClick={props.onClick} variant="contained">Close</Button>
        </form>
      </div>
    </div>
  )
}

function addProduct(e) {
  e.preventDefault();
  console.log(e.target)
  fetch('http://localhost:8080/api/products', {
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
