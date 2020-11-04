import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

export default () => {
    const { user, logout } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    return user &&
        (
            <div>
                <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    color="inherit">
                    <AccountCircle/>
                    <Typography>{user.username}</Typography>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => {
                        logout();
                        handleClose();
                    }}>Logout</MenuItem>
                </Menu>
            </div>
        );
}