import React, { useState, useEffect } from 'react';

export default () => {
  const [applicationsData, setData] = useState({
    isLoading: true,
    error: null,
    applications: null
  });

  useEffect(() => {
    fetch('http://localhost:8080/supplierapplications/')
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
        (applications != null
          ? applications.map(application => <SupplierApplications application={application} key={application.id} />)
          : 'Empty list')
      }
      {!isLoading && error && 'Error happens'}
    </>
  );
}

function SupplierApplications({ application }) {
  return (
    <div style={{ marginTop: 10 }}>
      <li>{application.id}</li>
      <a href={'/supplierapplications/' + application.id} style={{ fontSize: 10, color: "blue", float: "right", marginRight: 5, marginTop: -5 }}>Read more</a>
      <hr />
    </div>
  )
}