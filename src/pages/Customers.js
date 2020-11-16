import CustomerModal from '../modals/CustomerModal';
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

export default () => {
  const [customersData, setData] = useState({
    isLoading: true,
    error: null,
    customers: [],
    displayModal: false
  });

  useEffect(() => {
    fetch('http://localhost:8080/customers', {
      headers: {
        "Authorization": localStorage.getItem("token")
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(customers => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          customers
        }));
      })
      .catch(e => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          error: e
        }))
      })
  }, [customersData.displayModal]);

  const { isLoading, error, customers, displayModal } = customersData;

  return (
    <>
      {isLoading && 'Loading....'}
      {!isLoading && !error &&
        (customers.length != 0
          ? <Form onSubmit={changeCustomerStatus}>
            {customers.map(customer => <Customers customer={customer} key={customer.id} />)}
            <Button onClick={() => setData((prevState) => ({
              ...prevState,
              displayModal: true
            }))}>
              Add customer
            </Button>
            <Button type="submit">
              Enable/Disable
            </Button>
          </Form>
          : 'Empty list')
      }
      {!isLoading && error && 'Error happens'}
      {displayModal && <CustomerModal onClick={() => setData((prevState) => ({ ...prevState, displayModal: false }))} />}
    </>
  );
}

function changeCustomerStatus(e) {
  e.preventDefault();
  let customerIdList = [];
  e.target.customers.forEach(element => {
    element.checked && customerIdList.push(element.value);
  });
  fetch('http://localhost:8080/customers', {
    headers: {
      'Authorization': localStorage.getItem("token"),
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: {
      body: JSON.stringify({
        productIds: customerIdList
      })
    },
    method: "PUT"
  }); 
}

function Customers({ customer }) {
  return (
    <p><label><input type="checkbox" value={customer.id} name={"customers"} />
      <span>{customer.name} - {customer.registrationDate} -  {customer.customerStatus}  - {customer.email}</span></label></p>
  )
}