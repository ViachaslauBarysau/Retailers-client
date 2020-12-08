import React, {useEffect, useState} from 'react';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Pagination from "@material-ui/lab/Pagination";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import CategoryEditModal from './modal/CategoryEditModal';
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

export default () => {
    const [categoriesData, setData] = useState({
        isLoading: false,
        error: null,
        categories: [],
    });

    const [elementsOnPage, setElementsOnPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1)
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

    const handleChangePage = (event, value) => {
        setPageNumber(value - 1);
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
            .then(res => res.json())
            .then(categoriesPage => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    categories: categoriesPage.content
                }));
                setPageCount(categoriesPage.totalPages);
            })
            .catch(e => {
                setData((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    error: e
                }))
            })
    }, [pageNumber, needRefresh]);

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
                                <TableCell>Category name</TableCell>
                                <TableCell align="right">Category tax</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map(category => <Category category={category}
                                                                  key={category.id}/>)}
                        </TableBody>
                    </Table>
                </TableContainer>
                : 'Empty list')}
            <Pagination count={pageCount}
                        showFirstButton
                        showLastButton
                        page={pageNumber + 1}
                        onChange={handleChangePage}/>
            {!isLoading && error && 'Error happens'}
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
            <TableRow key={category.id}>
                <TableCell component="th" scope="row">
                    <a href="#" onClick={() => setDisplayEditModal({
                        displayModal: true,
                        categoryId: category.id
                    })}
                    >{category.name}</a>
                </TableCell>
                <TableCell align="right">{category.categoryTax}</TableCell>
            </TableRow>
        )
    }
}

