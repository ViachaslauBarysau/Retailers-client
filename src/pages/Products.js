import ProductModal from '../modals/ProductModal';
import React, {useState, useEffect} from 'react';
import {Button, Form} from 'react-bootstrap';

export default () => {
    const [productsData, setData] = useState({
        isLoading: true,
        error: null,
        products: [],
        displayModal: false,
    });

    useEffect(() => {
        fetch('http://localhost:8080/api/products', {
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
    }, [productsData.displayModal]);

    const {isLoading, error, products, displayModal} = productsData;

    return (
        <>
            {isLoading && 'Loading....'}
            {!isLoading && !error &&
            <Form onSubmit={removeProducts}>
                {(products.length != 0
                    ?
                    <table border="1" width="100%">
                        <thead>
                        <tr>
                            <th></th>
                            <th>UPC</th>
                            <th>Label</th>
                            <th>Category</th>
                            <th>Units</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(product => <Products product={product} key={product.id}/>)}
                        </tbody>
                    </table>
                    : 'Empty list')}
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
            }
            {!isLoading && error && 'Error happens'}
            {displayModal &&
            <ProductModal onClick={() => setData((prevState) => ({...prevState, displayModal: false}))}/>}
        </>
    );
}

function removeProducts(e) {
    e.preventDefault();
    let productIdList = [];
    e.target.products.forEach(element => {
        element.checked && productIdList.push({id: element.value});
    });
    fetch('http://localhost:8080/api/products', {
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(
            productIdList
        ),
        method: "DELETE"
    })
        .then(() => {

        });
}

function Products({product}) {
    return (
        <tr id={product.id}>
            <td><input type="checkbox" value={product.id} name={"products"}/></td>
            <td>{product.upc}</td>
            <td>{product.label}</td>
            <td>{product.category.name}</td>
            <td>{product.volume}</td>
        </tr>
    )
}