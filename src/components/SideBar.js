import { AuthContext } from '../context/authContext';
import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../App.styles';
import UserProfile from "./UserProfile";
import {makeStyles} from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MailIcon from "@material-ui/icons/Mail";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {Divider} from "@material-ui/core";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default () => {
    const classes = useStyles();
    const { user, logout } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(user);

                return (
                    <React.Fragment>
                        <ListItem button component={Link} to="/writeoffacts">
                            <ListItemIcon>{<ArrowForwardIosIcon />}</ListItemIcon>
                            <ListItemText primary={"Write-off acts"}/>
                        </ListItem>

                        <ListItem button component={Link} to="/customers">
                            <ListItemIcon>{<ArrowForwardIosIcon />}</ListItemIcon>
                            <ListItemText primary={"Customers"}/>
                        </ListItem>
                        <ListItem button component={Link} to="/supplierapplications">
                            <ListItemIcon>{<ArrowForwardIosIcon />}</ListItemIcon>
                            <ListItemText primary={"Supplier applications"}/>
                        </ListItem>

                        <ListItem button component={Link} to="/products">
                            <ListItemIcon>{<ArrowForwardIosIcon />}</ListItemIcon>
                            <ListItemText primary={"Products"}/>
                        </ListItem>
                        <ListItem button component={Link} to="/innerapplications">
                            <ListItemIcon>{<ArrowForwardIosIcon />}</ListItemIcon>
                            <ListItemText primary={"Inner applications"}/>
                        </ListItem>

                        <ListItem button component={Link} to="/bills">
                            <ListItemIcon>{<ArrowForwardIosIcon />}</ListItemIcon>
                            <ListItemText primary={"Bills"}/>
                        </ListItem>
                        <ListItem button component={Link} to="/locations">
                            <ListItemIcon>{<ArrowForwardIosIcon />}</ListItemIcon>
                            <ListItemText primary={"Locations"}/>
                        </ListItem>

                        <ListItem button component={Link} to="/users">
                            <ListItemIcon>{<ArrowForwardIosIcon />}</ListItemIcon>
                            <ListItemText primary={"Users"}/>
                        </ListItem>
                        <ListItem button component={Link} to="/location_products">
                            <ListItemIcon>{<ArrowForwardIosIcon />}</ListItemIcon>
                            <ListItemText primary={"Location products"}/>
                        </ListItem>
                        <ListItem button component={Link} to="/category">
                            <ListItemIcon>{<ArrowForwardIosIcon />}</ListItemIcon>
                            <ListItemText primary={"Category"}/>
                        </ListItem>
                        <ListItem button component={Link} to="/suppliers">
                            <ListItemIcon>{<ArrowForwardIosIcon />}</ListItemIcon>
                            <ListItemText primary={"Suppliers"}/>
                        </ListItem>
                        <Divider/>
                        <ListItem button onClick={logout}>
                            <ListItemIcon>{<ExitToAppIcon />}</ListItemIcon>
                            <ListItemText primary={"Logout"}/>
                        </ListItem>
                    </React.Fragment>

                )
    //                 <AppBar position={'static'}>
    //                     <Toolbar>
    //                         <Link to={'/customers'} className={classes.menuLink}>Customers</Link>
    //                         <Link to={'/supplierapplications'} className={classes.menuLink}>Sup. applications</Link>
    //                         <Link to={'/innerapplications'} className={classes.menuLink}>Inner applications</Link>
    //                         <Link to={'/products'} className={classes.menuLink}>Products</Link>
    //                         <Link to={'/bills'} className={classes.menuLink}>Bills</Link>
    //                         <Link to={'/locations'} className={classes.menuLink}>Locations</Link>
    //                         <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
    //                         <Link to={'/users'} className={classes.menuLink}>Users</Link>
    //                         <Link to={'/location_products'} className={classes.menuLink}>Location products</Link>
    //                         <Link to={'/category'} className={classes.lastMenuLink}>Category</Link>
    //                         <UserProfile />
    //                     </Toolbar>
    //                 </AppBar>
    //             );
    //             break;
    //         case "ADMIN":
    //             return (
    //                 <AppBar position={'static'}>
    //                     <Toolbar>
    //                         <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
    //                         <Link to={'/products'} className={classes.menuLink}>Products</Link>
    //                         <Link to={'/bills'} className={classes.menuLink}>Bills</Link>
    //                         <Link to={'/users'} className={classes.lastMenuLink}>Users</Link>
    //                         <UserProfile />
    //                     </Toolbar>
    //                 </AppBar>
    //             );
    //             break;
    //         case "DISPATCHER":
    //             return (
    //                 <AppBar position={'static'}>
    //                     <Toolbar>
    //                         <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
    //                         <Link to={'/products'} className={classes.lastMenuLink}>Products</Link>
    //                         <UserProfile />
    //                     </Toolbar>
    //                 </AppBar>
    //             );
    //             break;
    //         case "WAREHOUSE_MANAGER":
    //             return (
    //                 <AppBar position={'static'}>
    //                     <Toolbar>
    //                         <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
    //                         <Link to={'/products'} className={classes.menuLink}>Products</Link>
    //                         <Link to={'/bills'} className={classes.lastMenuLink}>Bills</Link>
    //                         <UserProfile />
    //                     </Toolbar>
    //                 </AppBar>
    //             );
    //             break;
    //         case "SHOP_MANAGER":
    //             return (
    //                 <AppBar position={'static'}>
    //                     <Toolbar>
    //                         <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
    //                         <Link to={'/products'} className={classes.menuLink}>Products</Link>
    //                         <Link to={'/bills'} className={classes.menuLink}>Bills</Link>
    //                         <Link to={'/users'} className={classes.lastMenuLink}>Users</Link>
    //                         <UserProfile />
    //                     </Toolbar>
    //                 </AppBar>
    //             );
    //             break;
    //         case ("DIRECTOR"):
    //             return (
    //                 <AppBar position={'static'}>
    //                     <Toolbar>
    //                         <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
    //                         <Link to={'/users'} className={classes.lastMenuLink}>Users</Link>
    //                         <UserProfile />
    //                     </Toolbar>
    //                 </AppBar>
    //             );
    //             break;
    //         default:
    //             return (
    //                 <AppBar position={'static'}>
    //                     <Toolbar>
    //                         <Link to={'/writeoffacts'} className={classes.menuLink}>Write-off acts</Link>
    //                         <Link to={'/customers'} className={classes.menuLink}>Customers</Link>
    //                         <Link to={'/supplierapplications'} className={classes.menuLink}>Applications</Link>
    //                         <Link to={'/products'} className={classes.menuLink}>Products</Link>
    //                         <Link to={'/bills'} className={classes.menuLink}>Bills</Link>
    //                         <Link to={'/locations'} className={classes.menuLink}>Locations</Link>
    //                         <Link to={'/users'} className={classes.lastMenuLink}>Users</Link>
    //                         <UserProfile />
    //                     </Toolbar>
    //                 </AppBar>
    //             );
    //     }
    // } else {
    //     return (
    //         <AppBar position={'static'}>
    //             <Toolbar>
    //                 <UserProfile />
    //             </Toolbar>
    //         </AppBar>
    //     );
    // }
}

