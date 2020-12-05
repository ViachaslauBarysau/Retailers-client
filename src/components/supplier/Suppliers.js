import SupplierModal from './modal/SupplierModal';
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

export default () => {
  const [suppliersData, setData] = useState({
    isLoading: false,
    error: null,
    suppliers: [],
    displayModal: false
  });

  useEffect(() => {
    setData(prevState => ({...prevState, isLoading: true}));
    fetch('http://localhost:8080/api/suppliers', {
      headers: {
        "Authorization": localStorage.getItem("token"),
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(suppliers => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          suppliers
        }));
      })
      .catch(e => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          error: e
        }))
      })
  }, [suppliersData.displayModal]);

  const { isLoading, error, suppliers, displayModal } = suppliersData;

  return (
    <>
      {isLoading && <LinearProgress  />}
      {!isLoading && !error &&
        <Form>
          {(suppliers.length != 0
            ?
            <table border="1" width="100%">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Registration date</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(supplier => <Suppliers supplier={supplier} key={supplier.id} />)}
              </tbody>
            </table>
            : 'Empty list')}
          <Button onClick={() => setData((prevState) => ({
            ...prevState,
            displayModal: true
          }))}>
            Add supplier
            </Button>
          <Button type="submit">
            Enable/Disable
            </Button>
        </Form>

      }
      {!isLoading && error && 'Error happens'}
      {displayModal && <SupplierModal onClick={() => setData((prevState) => ({ ...prevState, displayModal: false }))} />}
    </>
  );
}

function Suppliers({ supplier }) {
  return (
    <tr id={supplier.id}>
      <td><input type="checkbox" value={supplier.id} name={"suppliers"} /></td>
      <td>{supplier.fullName}</td>
      <td>{supplier.identifier}</td>
    </tr>
  )
}