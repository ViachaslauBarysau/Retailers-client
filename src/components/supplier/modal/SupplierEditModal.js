import '../../Modal.css';
import React, {useContext, useEffect, useState} from 'react';
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

const SupplierEditModal = (props) => {
    const {logout} = useContext(AuthContext)
    const [supplier, setSupplier] = useState(null)
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

    useEffect(() => {
        fetch('/api/suppliers/' + props.supplierId, {
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            method: "GET"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 401) {
                    logout();
                }
            })
            .then(supplier => {
                setSupplier(supplier);
                setWarehouseRows({
                        warehouses: supplier.wareHouseList.map(warehouse => {
                            {
                                return {
                                    ...warehouse,
                                    key: new Date().getTime() + (Math.random() * 100 + 1)
                                }
                            }
                        })
                    }
                )
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            })
    }, []);


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
        if (warehouseRows.warehouses.filter((warehouse) => (warehouse.key === key))[0].id == null) {
            setWarehouseRows((prevState) => ({
                    ...prevState,
                    warehouses: prevState.warehouses.filter((warehouse) => (warehouse.key !== key))
                })
            )
        } else {
            setWarehouseRows({
                warehouses: warehouseRows.warehouses.map((warehouse) => (warehouse.key === key ? {
                        ...warehouse,
                        status: "DELETED"
                    } : warehouse)
                )
            })
        }
    }

    function handleEditWarehouse(warehouse) {
        setEditedWarehouse(warehouse);
        setDisplayEditModal(true);
    }

    const editSupplier = (e) => {
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
                    ...supplier,
                    wareHouseList: warehouseRows.warehouses
                }),
                method: "PUT"
            })
                .then(res => {
                    switch (res.status) {
                        case 200:
                            props.handleOpenSnackBar("Supplier updated.", "success");
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

    function handleChangeName(e) {
        setSupplier({
                ...supplier,
                fullName: e.target.value
            }
        )
    }

    function handleChangeIdentifier(e) {
        setSupplier({
                ...supplier,
                identifier: e.target.value
            }
        )
    }

    return (
        <div>
            {supplier &&
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box supplier-modal"}>
                    <form onSubmit={editSupplier}>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   id="fullName"
                                   name="fullName"
                                   variant="outlined"
                                   value={supplier.fullName}
                                   label="Full name"
                                   onChange={handleChangeName}
                                   error={validationResults.includes("fullName")}
                                   helperText={validationResults.includes("fullName") ?
                                       "Name must be between 3 and 40 symbols." : ""}
                        />
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   type="number"
                                   id="identifier"
                                   value={supplier.identifier}
                                   variant="outlined"
                                   label="Identifier"
                                   onChange={handleChangeIdentifier}
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
                                            <TableCell align="right" width={5}/>
                                            <TableCell align="right" width={5}/>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {warehouseRows.warehouses.filter(warehouse => warehouse.status === "ACTIVE").map((warehouse) => (
                                            <TableRow key={warehouse}>
                                                <TableCell>{warehouse.name}</TableCell>
                                                <TableCell>{warehouse.address.city}, {warehouse.address.firstAddressLine}</TableCell>
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
                                variant="contained">Edit supplier</Button>
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
            }
        </div>

    )
}

export default SupplierEditModal;
