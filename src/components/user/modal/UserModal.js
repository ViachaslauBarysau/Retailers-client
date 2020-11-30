import '../../Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import {Button, TextField} from '@material-ui/core';
import StateSelect from '../../StateSelect';
import Select from "@material-ui/core/Select/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

const UserModal = (props) => {
  return (
    <div className={"modal-wrapper"}>
      <div onClick={props.onClick} className={"modal-backdrop"} />
      <div className={"modal-box"}>
        <form onSubmit={addUser}>
          <TextField size="small" id="name" fullWidth={true}
                     variant="outlined" label="Name"/>

          <br />
          <TextField size="small" id="surname" fullWidth={true}
                     variant="outlined" label="Surname"/>
          <br />
          <br />
          <TextField
              id="date_of_birth"
              label="Date of birth"
              type="date"
              defaultValue="2000-01-01"
              InputLabelProps={{
                shrink: true,
              }}
          />

          <InputLabel id="state-label">State:</InputLabel>
              <StateSelect/>
          <br />

          <br />
          <TextField size="small" name="city" id="city" fullWidth={true}
                     variant="outlined" label="City"/>

          <TextField size="small" name="address1" id="address1" fullWidth={true}
                     variant="outlined" label="Address line 1"/>

          <TextField size="small" name="address1" id="address2" fullWidth={true}
                     variant="outlined" label="Address line 2"/>

          <label>
            <InputLabel id="role-label">Role:</InputLabel>
            <Select
                variant="outlined"
                labelId="role-label"
                id="role"
                // value={age}
                // onChange={handleChange}
            >
              <MenuItem value={"DISPATCHER"}>Dispatcher</MenuItem>
              <MenuItem value={"WAREHOUSE_MANAGER"}>Warehouse manager</MenuItem>
              <MenuItem value={"SHOP_MANAGER"}>Shop manager</MenuItem>
              <MenuItem value={"DIRECTOR"}>Director</MenuItem>
            </Select>
          </label>

          <TextField size="small" name="login" id="login" fullWidth={true}
                     variant="outlined" label="Login"/>

          <TextField size="small" name="email" id="email" fullWidth={true}
                     variant="outlined" label="Email"/>

          <Button type="submit" variant="contained">Add user</Button>
          <Button id="closeButton" onClick={props.onClick} variant="contained">Close</Button>
        </form>
      </div>
    </div>
  )
}
//How to set user location? Password generator services.
function addUser(e) {
  e.preventDefault();
  fetch('http://localhost:8080/api/users', {
    headers: {
      'Authorization': localStorage.getItem("token"),
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      firstName: e.target.name.value,
      lastName: e.target.surname.value,
      email: e.target.email.value,
      userRole: [e.target.role.value],
      birthday: e.target.date_of_birth.value,
      userStatus: "ACTIVE",
      location: {
        id: "2"
      },
      customer: {
        id: JSON.parse(localStorage.getItem("user")).customer.id
      },
      address: {
        state:
        {
          id: e.target.state.value
        },
        city: e.target.city.value,
        firstAddressLine: e.target.address1.value,
        secondAddressLine: e.target.address2.value
      },
    }),
    method: "POST"
  });
  e.target.closeButton.click();
}

export default UserModal;


