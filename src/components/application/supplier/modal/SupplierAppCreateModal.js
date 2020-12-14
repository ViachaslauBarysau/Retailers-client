import '../../../Modal.css';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {TextField} from '@material-ui/core';
import Button from '../../../Button';
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {AuthContext} from "../../../../context/authContext";
import EditableApplicationRecord from "./record/EditableApplicationRecord";
import {validateSupplierAppItems} from "../../../../validation/ItemRecordValidator";
import {validateSupplierAppCreation} from "../../../../validation/ApplicationValidator";

const SupplierAppCreateModal = (props) => {
    const {user, logout} = useContext(AuthContext);
    const [itemRows, setItemRows] = useState({
        items: [{
            key: new Date().getTime(),
            upc: 0,
            amount: 0,
            cost: 0,
            upcError: false,
            amountError: false,
            costError: false

        }]
    });

    const [validationResults, setValidationResults] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetch('/api/products?size=100000', {
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
            .then(products => {
                setProducts(products.content)
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            });
        fetch('/api/suppliers?size=100000', {
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
            .then(suppliers => {
                setSuppliers(suppliers.content.flatMap(supplier => supplier.wareHouseList)
                    .filter(warehouse => warehouse.status === "ACTIVE"))
            })
            .catch(e => {
                props.handleOpenSnackBar("Error happens!", "error");
            });
    }, []);

    const addRow = (e) => {
        e.preventDefault();
        setItemRows((prevState) => {
                let newItems = prevState.items;
                let newRow = {
                    key: new Date().getTime(),
                    upc: 0,
                    amount: 0,
                    cost: 0,
                    upcError: false,
                    amountError: false,
                    costError: false
                };
                newItems.push(newRow);
                return ({
                    ...prevState,
                    items: newItems
                })
            }
        );
    };

    const changeRecord = (e, key) => {
        switch (e.name) {
            case "upc":
                setItemRows((prevState) => ({
                        ...prevState,
                        items: itemRows.items.map(item => item.key === key ? {...item, upc: e.value} : item)
                    })
                );
                break;
            case "amount":
                setItemRows((prevState) => ({
                        ...prevState,
                        items: itemRows.items.map(item => item.key === key ? {...item, amount: e.value} : item)
                    })
                );
                break;
            case "cost":
                setItemRows((prevState) => ({
                        ...prevState,
                        items: itemRows.items.map(item => item.key === key ? {
                                ...item,
                                cost: Number(e.value).toFixed(2) / 1
                            }
                            : item)
                    })
                );
                break;
            default:
                if (itemRows.items.length > 1) {
                    setItemRows((prevState) => ({
                            ...prevState,
                            items: prevState.items.filter((item) => (item.key !== key))
                        })
                    );
                }
                break;
        }
    };

    const calculateVolume = () => {
        let totalVolume = 0;
        itemRows.items.forEach((item) => {
                totalVolume += products.filter((product) => (product.upc === Number(item.upc)))[0].volume * item.amount
            }
        );
        return totalVolume;
    }

    const calculateAmount = () => {
        let totalAmount = 0;
        itemRows.items.forEach((item) => {
                totalAmount += Number(item.amount);
            }
        );
        return totalAmount;
    }

    const getRecordsList = () => {
        let recordsList = itemRows.items.map((item) => (
            {
                product: products.filter((product) => (product.upc === Number(item.upc)))[0],
                amount: item.amount,
                cost: item.cost
            }
        ));
        return recordsList;
    }

    let dateTime = useMemo(() => new Date(), [])

    const createApplication = (e) => {
        e.preventDefault(e);
        let validatedItems = validateSupplierAppItems(itemRows.items);
        let validResults = validateSupplierAppCreation(e);
        if (validatedItems.filter(item => item.upcError === true ||
            item.amountError === true || item.costError === true).length === 0 &&
            validResults.length === 0) {
            fetch('/api/supplier_applications', {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    applicationNumber: Number(e.target.appNumber.value),
                    supplierWarehouse: suppliers.filter(supplier => supplier.name === e.target.supplierWarehouse.value)[0],
                    destinationLocation: user.location,
                    creator: user,
                    updater: user,
                    registrationDateTime: dateTime,
                    updatingDateTime: dateTime,
                    applicationStatus: "OPEN",
                    recordsList: getRecordsList(),
                    totalProductAmount: calculateAmount(),
                    totalUnitNumber: calculateVolume()
                }),
                method: "POST"
            })
                .then(res => {
                    switch (res.status) {
                        case 201:
                            props.handleOpenSnackBar("Application created!", "success");
                            props.onCloseModal();
                            props.needrefresh();
                            break;
                        case 401:
                            logout();
                            break;
                        case 451:
                            props.handleOpenSnackBar("Application number should be unique!", "warning");
                            break;
                    }
                })
                .catch(e => {
                    props.handleOpenSnackBar("Error happens!", "error");
                });
        }
        setItemRows({
            items: validatedItems
        });
        setValidationResults(validResults);
    }

    return (
        <div>
            <div className={"modal-wrapper"}>
                <div onClick={props.onCloseModal} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    <form onSubmit={createApplication}>
                        <TextField size="small"
                                   fullWidth={true}
                                   id="appNumber"
                                   variant="outlined"
                                   label="Application number"
                                   type="number"
                                   error={validationResults.includes("appNumber")}
                                   helperText={validationResults.includes("appNumber") ?
                                       "Application number must be between 1 and 999999999." : ""}/>

                        <Autocomplete
                            id="supplier"
                            size="small"
                            name="supplierWarehouse"
                            clearOnEscape
                            options={suppliers.map((option) => option.name.toString())}
                            renderInput={(params) => (
                                <TextField {...params}
                                           fullWidth={true}
                                           label="Supplier warehouse"
                                           margin="dense"
                                           variant="outlined"
                                           required/>
                            )}
                        />
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   id="locationId"
                                   variant="outlined"
                                   value={user.location.identifier}
                                   label="Destination location"
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   id="creator"
                                   variant="outlined"
                                   label="Created by"
                                   value={`${user.firstName} ${user.lastName}`}
                                   disabled/>
                        <TextField margin="dense"
                                   size="small"
                                   fullWidth={true}
                                   variant="outlined"
                                   label="Registration date and time"
                                   value={dateTime}
                                   disabled/>
                        <div className="scrollable-box">
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    {itemRows.items.map((item) => (
                                        <EditableApplicationRecord item={item}
                                                                   products={products}
                                                                   changeRecord={changeRecord}
                                                                   key={item.key}/>))}
                                </Grid>
                            </Grid>
                        </div>
                        <Button my={1} onClick={addRow}
                                variant="contained">Add product</Button>
                        <br/>

                        <Button my={1} type="submit"
                                variant="contained">Save application</Button>
                        <Button m={1} id="closeButton"
                                onClick={props.onCloseModal}
                                variant="contained">Close</Button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default SupplierAppCreateModal;
