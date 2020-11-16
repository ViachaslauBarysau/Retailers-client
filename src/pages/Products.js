import ProductModal from '../modals/ProductModal';
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

export default () => {
  const [productsData, setData] = useState({
    isLoading: true,
    error: null,
    products: [],
    displayModal: false,
  });

  useEffect(() => {
    fetch('http://localhost:8080/products', {
      headers: {
        'Authorization': localStorage.getItem("token"),
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(products => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          products
        }));
      })
      .catch(e => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          error: e
        }))
      })
  }, []);

  const { isLoading, error, products, displayModal } = productsData;

  return (
    <>
      {isLoading && 'Loading....'}
      {!isLoading && !error &&
        (products.length != 0
          ? <Form onSubmit={removeProducts}>
            {products.map(product => <Products product={product} key={product.id} />)}
            <Button onClick={() => setData((prevState) => ({
              ...prevState,
              displayModal: true
            }))}>
              Add product
            </Button>
            <Button type="submit">
              Remove product
            </Button>
          </Form>
          : 'Empty list')
      }
      {!isLoading && error && 'Error happens'}
      {displayModal && <ProductModal onClick={() => setData((prevState) => ({ ...prevState, displayModal: false }))} />}
    </>
  );
}

function removeProducts(e) {
  e.preventDefault();
  let productIdList = [];
  e.target.products.forEach(element => {
    element.checked && productIdList.push({id: element.value});
  });
  fetch('http://localhost:8080/products', {
    headers: {
      'Authorization': localStorage.getItem("token"),
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(
      productIdList
    ),
    method: "DELETE"
  });
}

function Products({ product }) {
  return (
    <p><label><input type="checkbox" value={product.id} name={"products"} />
      <span>{product.upc} - {product.label} - {product.category.name} - {product.volume}</span></label></p>
  )
}