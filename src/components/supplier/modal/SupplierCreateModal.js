import '../../Modal.css';
import React, {useContext, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../Button';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import EditIcon from '@material-ui/icons/Edit';
import SupplierWarehouseCreateModal from "./SupplierWarehouseCreateModal";
import SupplierWarehouseEditModal from "./SupplierWarehouseEditModal";
import {AuthContext} from "../../../context/authContext";
import {validateSupplier} from "../../../validation/SupplierValidator";

const SupplierCreateModal = (props) => {
    const {user, logout} = useContext(AuthContext);
    const [validationResults, setValidationResults] = useState([]);
    const [warehouseRows, setWarehouseRows] = useState({
        warehouses: []
    });

    const [editedWarehouse, setEditedWarehouse] = useState(null);

    const [displayUpperModal, setDisplayCreateModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState(false);

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

    const handleChangeWarehouse = (warehouse) => {
        setWarehouseRows((prevState) => {
            let newWarehouseList = prevState.warehouses;
            newWarehouseList = newWarehouseList.filter(value => value.key !== warehouse.key);
            newWarehouseList.push(warehouse)
            return ({
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
        setEditedWarehouse(warehouse);
        setDisplayEditModal(true);
    }

    function getWarehouseList() {
        return warehouseRows.warehouses.map(warehouse => {
            delete warehouse.key;
            return warehouse
        })
    }

    const createSupplier = (e) => {
        e.preventDefault(e);
        let validResults = validateSupplier(e);
        if (validResults.length === 0) {
            fetch('/api/suppliers', {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    fullName: e.target.fullName.value,
                    identifier: e.target.identifier.value,
                    customer: user.customer,
                    supplierStatus: "ACTIVE",
                    wareHouseList: getWarehouseList(),
                }),
                method: "POST"
            })
                .then(res => {
                    switch (res.status) {
                        case 201:
                            props.handleOpenSnackBar("Supplier created!", "success");
                            props.onCloseModal();
                            props.needrefresh();
                            break;
                        case 401:
                            logout();
                            break;
                        case 451:
                            props.handleOpenSnackBar("Supplier number should be unique.", "warning");
                            break;
                    }
                })
                .catch(e => {
                    props.handleOpenSnackBar("Error happens.", "error");
                });
        }
        setValidationResults(validResults);
    }

    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
            <div className={"modal-box supplier-modal"}>
                <form onSubmit={createSupplier}>
                    <TextField margin="dense"
                               size="small"
                               fullWidth={true}
                               id="fullName"
                               name="fullName"
                               variant="outlined"
                               label="Full name"
                               error={validationResults.includes("fullName")}
                               helperText={validationResults.includes("fullName") ?
                                   "Name must be between 3 and 40 symbols." : ""}
                    />
                    <TextField margin="dense"
                               size="small"
                               type="number"
                               fullWidth={true}
                               id="identifier"
                               variant="outlined"
                               label="Identifier"
                               error={validationResults.includes("identifier")}
                               helperText={validationResults.includes("identifier") ?
                                   "Identifier value must be between 1 and 999999999." : ""}
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
                                    {warehouseRows.warehouses.filter(warehouse => warehouse.status === "ACTIVE").map((warehouse) => (
                                        <TableRow key={warehouse}>
                                            <TableCell>{warehouse.name}</TableCell>
                                            <TableCell>{warehouse.address.state.id}, {warehouse.address.city}, {warehouse.address.address1}</TableCell>
                                            <TableCell align="right"><EditIcon
                                                onClick={() => handleEditWarehouse(warehouse)}/></TableCell>
                                            <TableCell align="right"><HighlightOffIcon
                                                onClick={() => handleDeleteWarehouse(warehouse.key)}/></TableCell>
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
                {displayUpperModal && <SupplierWarehouseCreateModal editedWarehouse={editedWarehouse}
                                                                    onClose={() => {
                                                                        setDisplayCreateModal(false);
                                                                        setEditedWarehouse(null)
                                                                    }}
                                                                    addWarehouse={handleAddWarehouse}/>}
                {displayEditModal && <SupplierWarehouseEditModal editedWarehouse={editedWarehouse}
                                                                 onClose={() => {
                                                                     setDisplayEditModal(false);
                                                                     setEditedWarehouse(null)
                                                                 }}
                                                                 addWarehouse={handleChangeWarehouse}/>}
            </div>

        </div>
    )
}

export default SupplierCreateModal;
