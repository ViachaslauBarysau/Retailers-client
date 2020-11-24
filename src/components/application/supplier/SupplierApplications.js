import React, {useEffect, useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import SupplierAppCreateModal from './modal/SupplierAppCreateModal';
import SupplierAppEditModal from "./modal/SupplierAppEditModal";

export default () => {
    const [applicationsData, setData] = useState({
        isLoading: true,
        error: null,
        applications: [],
    });

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        appId: null
    });


    useEffect(() => {
        fetch('http://localhost:8080/api/supplier_applications', {
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

    const {isLoading, error, applications} = applicationsData;

    return (
        <div>
            {isLoading && 'Loading....'}
            {!isLoading && !error &&
            <Form>
                {(applications.length !== 0
                    ?
                    <table border="1" width="100%">
                        <thead>
                        <tr>
                            <th>Application number</th>
                            <th>Supplier identifier</th>
                            <th>Destination location</th>
                            <th>Update date and time</th>
                            <th>Last updated by</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {applications.map(application => <SupplierApplications application={application}
                                                                               key={application.id}/>)}
                        </tbody>
                    </table>
                    : 'Empty list')}
                <Button onClick={() => setDisplayCreateModal(true)}>
                    Add application
                </Button>
            </Form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <SupplierAppCreateModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <SupplierAppEditModal appId={displayEditModal.appId}
                                                       onCloseModal={() => setDisplayEditModal({
                                                           displayModal: false,
                                                           appId: null
                                                       })}
            />}
        </div>
    );

    function SupplierApplications({application}) {
        return (
            <tr>
                <td><a href="#" onClick={() => setDisplayEditModal({
                    displayModal: true,
                    appId: application.id
                })}
                       id={application.id}>{application.applicationNumber}</a></td>
                <td>{application.supplier.identifier}</td>
                <td>{application.destinationLocation.identifier}</td>
                <td>{application.updatingDateTime}</td>
                <td>{application.updater.firstName} {application.updater.lastName}</td>
                <td>{application.applicationStatus}</td>
            </tr>
        )
    }
}

