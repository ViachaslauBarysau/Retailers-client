import '../../Modal.css';
import React, {useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../Button';
import SupplierUpperModal from "./SupplierUpperModal";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import EditIcon from '@material-ui/icons/Edit';

const SupplierCreateModal = (props) => {
    const [warehouseRows, setWarehouseRows] = useState({
        warehouses: []
    });

    const [editedWarehouse, setEditedWarehouse] = useState(null);

    const [displayUpperModal, setDisplayCreateModal] = useState(false);

    const handleAddWarehouse = (warehouse) => {
        setWarehouseRows((prevState) => {
            let newWarehouseList = prevState.warehouses;
            newWarehouseList.push(warehouse)
            return ({
                ...prevState,
                warehouses: newWarehouseList
            })
        })
    }

    function handleDeleteWarehouse(key) {
        setWarehouseRows((prevState) => ({
                ...prevState,
            warehouses: prevState.warehouses.filter((warehouse) => (warehouse.key !== key))
            })
        );
    }

    function handleEditWarehouse(warehouse) {
        setEditedWarehouse(warehouse)
    }

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
            <div className={"modal-box supplier-modal"}>
                <form>
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               id="billNumber"
                               variant="outlined"
                               label="Full name"
                    />
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               id="locationId"
                               variant="outlined"
                               label="Identifier"
                    />
                    <div className="scrollable-box supplier-box-modal">
                        <TableContainer component={Paper}>
                            <Table size="small"
                                   aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="center">Address</TableCell>
                                        <TableCell align="right" width={5}></TableCell>
                                        <TableCell align="right" width={5}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {warehouseRows.warehouses.map((warehouse) => (
                                        <TableRow key={warehouse}>
                                            <TableCell>{warehouse.name}</TableCell>
                                            <TableCell>{warehouse.address.state.id}, {warehouse.address.city}, {warehouse.address.address1}</TableCell>
                                            <TableCell align="right"><EditIcon onClick={() => handleEditWarehouse(warehouse)}/></TableCell>
                                            <TableCell align="right"><HighlightOffIcon onClick={() => handleDeleteWarehouse(warehouse.key)}/></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <Button my={1} onClick={() => setDisplayCreateModal(true)}
                            variant="contained">Add warehouse</Button>
                    <br/>
                    <Button my={1} type="submit"
                            variant="contained">Add supplier</Button>
                    <Button m={1} id="closeButton"
                            onClick={props.onCloseModal}
                            variant="contained">Close</Button>
                </form>
                {displayUpperModal && <SupplierUpperModal editedWarehouse={editedWarehouse}
                                                          onClose={() => {setDisplayCreateModal(false); setEditedWarehouse(null)}}
                                                          addWarehouse={handleAddWarehouse}/>}
            </div>

        </div>
    )
}

export default SupplierCreateModal;
