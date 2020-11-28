import '../../modals/Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import {Button, TextField} from '@material-ui/core';
import StateSelect from '../../modals/formSelects/StateSelect';
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
            <InputLabel id="demo-simple-select-label">Role:</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="role"
                // value={age}
                // onChange={handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>

            {/*<select id="role">*/}
            {/*  <option value="DISPATCHER">Dispatcher</option>*/}
            {/*  <option value="WAREHOUSE_MANAGER">Warehouse manager</option>*/}
            {/*  <option value="SHOP_MANAGER">Shop manager</option>*/}
            {/*  <option value="DIRECTOR">Director</option>*/}
            {/*</select>*/}
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


