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
        "Authorization": localStorage.getItem("token"),
        'Content-Type': 'application/json',
        Accept: 'application/json'
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
        <Form onSubmit={changeCustomerStatus}>
          {(customers.length != 0
            ?
            <table border="1" width="100%">
              <tr>
                <th></th>
                <th>Name</th>
                <th>Registration date</th>
                <th>Status</th>
                <th>Admin's email</th>
              </tr>
              {customers.map(customer => <Customers customer={customer} key={customer.id} />)}
            </table>
            : 'Empty list')}
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
      body: JSON.stringify(
        customerIdList
      )
    },
    method: "PUT"
  });
}

function Customers({ customer }) {
  return (
    <tr id={customer.id}>
      <td><input type="checkbox" value={customer.id} name={"customers"} /></td>
      <td>{customer.name}</td>
      <td>{customer.registrationDate}</td>
      <td>{customer.customerStatus}</td>
      <td>{customer.email}</td>
    </tr>
  )
}