import React, { useState, useEffect } from 'react';

export default () => {
    const [productsData, setData] = useState({
        products: [],
    });

    useEffect(() => {
        fetch('http://localhost:8080/products?size=100000', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(products => {
                setData((prevState) => ({
                    ...prevState,
                    products
                }));
            })
    }, []);

    const { products } = productsData;

    return (
        <select id="product">
            {products.map(product => <Products product={product} key={product.id} />)}
        </select>
    )
}

function Products({ product }) {
    return (
    <option value={product.id}>{product.label}</option>
    )
}