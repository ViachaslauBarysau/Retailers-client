import React, { useState, useEffect } from 'react';

export default () => {
    const [customersData, setData] = useState({
        isLoading: false,
        error: null,
        customers: null
    });

useEffect(()=>{
    setData(prevState => ({...prevState, isLoading: true}));
       fetch('http://localhost:8080/customers/', Headers={})
        .then(res => res.json())
        .then(customers => {
          setData((prevState)=>({
            ...prevState,
            isLoading: false,
            customers
          }));
      })
      .catch(e => {
        setData((prevState)=>({
          ...prevState,
          isLoading: false,
          error: e
        }))
      })
  }, []);
  
  const {isLoading, error, customers} = customersData;
  
  return  (
    <>
    {isLoading && 'Loading....'}
    {!isLoading && !error &&
        (customers != null
          ? customers.map(customer => <Customers customer={customer} key={customer.id}/>)
          : 'Empty list')
    }
    {!isLoading && error && 'Error happens'}
    </>
  );
}

function Customers({customer}){
  return (
    <div style={{marginTop: 10}}>
      <li>{customer.id}</li>
      <a href={'/customers/' + customer.id} style={{fontSize: 10, color: "blue", float: "right", marginRight: 5, marginTop: -5}}>Read more</a>
      <hr />
    </div>
  )
}