import React, {useEffect, useState} from 'react';
import InnerAppCreateModal from "./modal/InnerAppCreateModal";
import InnerAppEditModal from "./modal/InnerAppEditModal";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";

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
        fetch('http://localhost:8080/api/inner_applications', {
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
            <form>
                {(applications.length !== 0
                    ?
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Application number</TableCell>
                                    <TableCell align="right">Source Location</TableCell>
                                    <TableCell align="right">Destination location</TableCell>
                                    <TableCell align="right">Update date and time</TableCell>
                                    <TableCell align="right">Last updated by</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {applications.map(application => <InnerApplications application={application}
                                                                                    key={application.id}/>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : 'Empty list')}
                <Button variant="contained" onClick={() => setDisplayCreateModal(true)}>
                    Add application
                </Button>
            </form>
            }
            {!isLoading && error && 'Error happens'}
            {displayCreateModal && <InnerAppCreateModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <InnerAppEditModal appId={displayEditModal.appId}
                                                                    onCloseModal={() => setDisplayEditModal({
                                                                        displayModal: false,
                                                                        appId: null
                                                                    })}
            />}
        </div>
    );

    function InnerApplications({application}) {
        return (
        <TableRow key={application.applicationNumber}>
            <TableCell component="th" scope="row">
                <a href="#" onClick={() => setDisplayEditModal({
                    displayModal: true,
                    appId: application.id
                })}>{application.applicationNumber}</a>
            </TableCell>
            <TableCell align="right">{application.sourceLocation.identifier}</TableCell>
            <TableCell align="right">{application.destinationLocation.identifier}</TableCell>
            <TableCell align="right">{application.updatingDateTime}</TableCell>
            <TableCell align="right">{application.updater.firstName} {application.updater.lastName}</TableCell>
            <TableCell align="right">{application.applicationStatus}</TableCell>
        </TableRow>
        )
    }
}

