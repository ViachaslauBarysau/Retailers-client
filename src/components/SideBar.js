import {AuthContext} from '../context/authContext';
import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AssignmentIcon from '@material-ui/icons/Assignment';
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {Divider} from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default () => {
    const {user, logout} = useContext(AuthContext);

    return (
        <React.Fragment>
            {user && (user.userRole[0] === "DIRECTOR" || user.userRole[0] === "DISPATCHER" ||
                user.userRole[0] === "SHOP_MANAGER" || user.userRole[0] === "WAREHOUSE_MANAGER") &&
            <ListItem button component={Link} to="/writeoffacts">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Write-off acts"}/>
            </ListItem>
            }
            {user && user.userRole[0] === "SYSTEM_ADMIN" &&
            <ListItem button component={Link} to="/customers">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Customers"}/>
            </ListItem>
            }
            {user && user.userRole[0] === "DISPATCHER" &&
            <ListItem button component={Link} to="/supplierapplications">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Supplier applications"}/>
            </ListItem>
            }
            {user && user.userRole[0] === "DISPATCHER" &&
            <ListItem button component={Link} to="/products">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Products"}/>
            </ListItem>
            }
            {user && (user.userRole[0] === "WAREHOUSE_MANAGER" || user.userRole[0] === "SHOP_MANAGER") &&
            <ListItem button component={Link} to="/innerapplications">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Inner applications"}/>
            </ListItem>
            }
            {user && user.userRole[0] === "SHOP_MANAGER" &&
            <ListItem button component={Link} to="/bills">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Bills"}/>
            </ListItem>
            }
            {user && user.userRole[0] === "ADMIN" &&
            <ListItem button component={Link} to="/locations">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Locations"}/>
            </ListItem>
            }
            {user && user.userRole[0] === "ADMIN" &&
            <ListItem button component={Link} to="/users">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Users"}/>
            </ListItem>
            }
            {user && (user.userRole[0] === "WAREHOUSE_MANAGER" || user.userRole[0] === "SHOP_MANAGER" ||
                user.userRole[0] === "DISPATCHER") &&
            <ListItem button component={Link} to="/location_products">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Location products"}/>
            </ListItem>
            }
            {user && user.userRole[0] === "DIRECTOR" &&
            <ListItem button component={Link} to="/category">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Category"}/>
            </ListItem>
            }
            {user && user.userRole[0] === "ADMIN" &&
            <ListItem button component={Link} to="/suppliers">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Suppliers"}/>
            </ListItem>
            }
            {user && user.userRole[0] === "DIRECTOR" &&
            <ListItem button component={Link} to="/location_tax">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary={"Location tax"}/>
            </ListItem>
            }
            <Divider/>
            <ListItem button onClick={logout}>
                <ListItemIcon>{<ExitToAppIcon/>}</ListItemIcon>
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

