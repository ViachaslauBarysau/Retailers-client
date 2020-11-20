import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import InnerAppModal from '../modals/InnerAppModal';

export default () => {
  const [applicationsData, setData] = useState({
    isLoading: true,
    error: null,
    applications: [],
    displayModal: false
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/innerapplications', {
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

  const { isLoading, error, applications } = applicationsData;

  return (
    <>
      {isLoading && 'Loading....'}
      {!isLoading && !error &&
        <Form>
          {(applications.length != 0
            ?
            <table border="1" width="100%">
              <thead>
                <tr>
                  <th></th>
                  <th>Application number</th>
                  <th>Source location</th>
                  <th>Destination location</th>
                  <th>Update date and time</th>
                  <th>Last updated by</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(application => <SupplierApplications application={application} key={application.id} />)}
              </tbody>
            </table>
            : 'Empty list')}
          <Button onClick={() => setData((prevState) => ({
            ...prevState,
            displayModal: true
          }))}>
            Add customer
            </Button>
        </Form>
      }
      {!isLoading && error && 'Error happens'}
      {displayModal && <InnerApplications onClick={() => setData((prevState) => ({ ...prevState, displayModal: false }))} />}
    </>
  );
}

function InnerApplications({ application }) {
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