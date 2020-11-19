import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import SupplierAppModal from '../modals/SupplierAppModal';
import UpperProductModal from '../modals/upperModals/UpperProductModal';

export default () => {
  const [applicationsData, setData] = useState({
    isLoading: true,
    error: null,
    applications: [],
    displayModal: false,
    displayUpperModal: false
  });

  useEffect(() => {
    fetch('http://localhost:8080/supplierapplications', {
      headers: {
        "Authorization": localStorage.getItem("token"),
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(applications => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          applications
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

  const { isLoading, error, applications, displayModal, displayUpperModal } = applicationsData;

  return (
    <>
      {isLoading && 'Loading....'}
      {!isLoading && !error &&
        <Form>
          {(applications.length != 0
            ?
            <table border="1" width="100%">
              <tr>
                <th></th>
                <th>Application number</th>
                <th>Source location</th>
                <th>Destination location</th>
                <th>Update date and time</th>
                <th>Last updated by</th>
                <th>Status</th>
              </tr>
              {applications.map(application => <SupplierApplications application={application} key={application.id} />)}
            </table>
            : 'Empty list')}
          <Button onClick={() => setData((prevState) => ({
            ...prevState,
            displayModal: true
          }))}>
            Add application
            </Button>
        </Form>
      }
      {!isLoading && error && 'Error happens'}
      {displayModal && <SupplierAppModal onCloseModal={() => setData((prevState) => ({ ...prevState, displayModal: false }))}
        onCloseUpperModal={() => setData((prevState) => ({ ...prevState, displayUpperModal: false }))}
        onOpenUpperModal={() => setData((prevState) => ({ ...prevState, displayUpperModal: true }))} />}
              {displayUpperModal && <UpperProductModal
        onCloseUpperModal={() => setData((prevState) => ({ ...prevState, displayUpperModal: false }))} />}
    </>
  );
}

function SupplierApplications({ application }) {
  return (
    <tr id={application.id}>
      <td></td>
      <td>{application.applicationNumber}</td>
      <td>{application.supplier.identifier}</td>
      <td>{application.destinationLocation.identifier}</td>
      <td>{application.updatingDateTime}</td>
      <td>{application.updater}</td>
      <td>{application.applicationStatus}</td>
    </tr>
  )
}