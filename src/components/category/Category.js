import React, {useContext, useEffect, useState} from 'react';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import {StyledTableCell, StyledTableRow} from "../Table"
import TableContainer from "@material-ui/core/TableContainer";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import CategoryEditModal from './modal/CategoryEditModal';
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import TablePagination from "@material-ui/core/TablePagination";
import {AuthContext} from "../../context/authContext";
import Typography from "@material-ui/core/Typography";

export default () => {
    const {logout} = useContext(AuthContext);
    const [categoriesData, setData] = useState({
        isLoading: false,
        error: null,
        categories: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [needRefresh, setNeedRefresh] = useState(false);

    const [displayEditModal, setDisplayEditModal] = useState({
        displayModal: false,
        categoryId: null
    });

    const [snackBar, setSnackBar] = useState({
        display: false,
        message: "",
        severity: "success"
    });

    const handleOpenSnackBar = (message, severity) => {
        setSnackBar({
            display: true,
            message,
            severity
        });
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({
            display: false,
            message: ""
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setElementsOnPage(+event.target.value);
        setPageNumber(0);
    };

    const handleChangePage = (event, newPage) => {
        setPageNumber(newPage);
    };

    useEffect(() => {
        setData(prevState => ({...prevState, isLoading: true}));
        fetch('/api/categories?page=' + pageNumber + '&size=' + elementsOnPage, {
            headers: {
                "Authorization": localStorage.getItem("token"),
                'Content-Type': 'application/json',
                Accept: 'application/json'
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
            .then(categoriesPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    categories: categoriesPage.content
                }));
                setTotalElements(categoriesPage.totalElements)
                if (pageNumber > categoriesPage.totalPages - 1 && pageNumber !== 0) {
                    setPageNumber(pageNumber - 1);
                }
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber, needRefresh, elementsOnPage]);

    const {isLoading, error, categories} = categoriesData;

    return (
        <div>
            {isLoading && <LinearProgress/>}
            {!isLoading && !error &&
            (categories.length != 0
                ? <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Category name</StyledTableCell>
                                <StyledTableCell>Category tax</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map(category => <Category category={category}
                                                                  key={category.id}/>)}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={totalElements}
                        page={pageNumber}
                        onChangePage={handleChangePage}
                        rowsPerPage={elementsOnPage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </TableContainer>
                : <Typography
                    style={{
                        textAlign: 'center',
                        margin: '10px'
                    }}
                    variant='h6'
                >
                    No records.
                </Typography>)}
            {!isLoading && error &&
            <Typography
                style={{
                    textAlign: 'center',
                    margin: '10px'
                }}
                variant='h6'
            >
                Error happens.
            </Typography>}
            {displayEditModal.displayModal && <CategoryEditModal categoryId={displayEditModal.categoryId}
                                                                 handleOpenSnackBar={(message, severity) =>
                                                                     handleOpenSnackBar(message, severity)}
                                                                 needrefresh={() => setNeedRefresh(!needRefresh)}
                                                                 onCloseModal={() => setDisplayEditModal({
                                                                     displayModal: false,
                                                                     categoryId: null
                                                                 })}
            />}
            <Snackbar open={snackBar.display} autoHideDuration={6000} onClose={handleCloseSnackBar}>
                <Alert onClose={handleCloseSnackBar} severity={snackBar.severity}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
        </div>
    );

    function Category({category}) {
        return (
            <StyledTableRow key={category.id}>
                <StyledTableCell component="th" scope="row">
                    <a href="#" onClick={() => setDisplayEditModal({
                        displayModal: true,
                        categoryId: category.id
                    })}
                    >{category.name}</a>
                </StyledTableCell>
                <StyledTableCell>{category.categoryTax}</StyledTableCell>
            </StyledTableRow>
        )
    }
}

