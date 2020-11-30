import ActCreateModal from './modal/ActCreateModal';
import ActEditModal from './modal/ActEditModal';
import React, {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";

export default () => {
    const [actsData, setData] = useState({
        isLoading: true,
        error: null,
        acts: null,
    });

    const [displayCreateModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        actId: null
    });

    useEffect(() => {
        fetch('http://localhost:8080/api/write_off_acts', {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(acts => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    acts
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

    const {isLoading, error, acts, displayModal} = actsData;

    return (
        <div>
            {isLoading && 'Loading....'}
            {!isLoading && !error &&
            (acts.length != 0
                ? <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Identifier</TableCell>
                                <TableCell>Date and Time</TableCell>
                                <TableCell>Total amount of products</TableCell>
                                <TableCell>Total price of products</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {acts.map(act => <Acts act={act} key={act.id}/>)}
                        </TableBody>
                    </Table>
                </TableContainer>
                : 'Empty list')
            }
            {!isLoading && error && 'Error happens'}
            <Button onClick={() => setDisplayCreateModal(true)}>
                Add write-off act
            </Button>
            {displayCreateModal && <ActCreateModal onCloseModal={() => setDisplayCreateModal(false)}/>}
            {displayEditModal.displayModal && <ActEditModal actId={displayEditModal.actId}
                                                            onCloseModal={() => setDisplayEditModal({
                                                                displayModal: false,
                                                                actId: null
                                                            })}
            />}
        </div>
    );

    function Acts({act}) {
        return (
            <TableRow>
                <TableCell>
                    <a href="#" onClick={() => setDisplayEditModal({
                        displayModal: true,
                        actId: act.id
                    })}>{act.writeOffActNumber}</a>
                </TableCell>
                <TableCell>{act.actDateTime}</TableCell>
                <TableCell>{act.totalProductAmount}</TableCell>
                <TableCell>{act.totalProductSum}</TableCell>
            </TableRow>
        )
    }
}

