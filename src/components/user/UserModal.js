import '../../modals/Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';
import StateSelect from '../../modals/formSelects/StateSelect';

const UserModal = (props) => {
  return (
    <div className={"modal-wrapper"}>
      <div onClick={props.onClick} className={"modal-backdrop"} />
      <div className={"modal-box"}>
        <form onSubmit={addUser}>
          <label> Name:
              <input type="text" id="name" />
          </label>
          <br />
          <label> Surname:
              <input type="text" id="surname" />
          </label>
          <br />
          <label> Date of birth:
              <input type="date" id="date_of_birth" />
          </label>
          <br />
          <label> State:
            <StateSelect />
          </label>
          <br />
          <label> City:
              <input type="text" name="city" />
          </label>
          <br />
          <label> Address line 1:
              <input type="text" name="address1" />
          </label>
          <br />
          <label> Address line 2:
              <input type="text" name="address2" />
          </label>
          <br />
          <label> Role:
          <select id="role">
              <option value="DISPATCHER">Dispatcher</option>
              <option value="WAREHOUSE_MANAGER">Warehouse manager</option>
              <option value="SHOP_MANAGER">Shop manager</option>
              <option value="DIRECTOR">Director</option>
            </select>
          </label>
          <br />
          <label> Login:
              <input type="text" name="login" />
          </label>
          <br />
          <label> Email:
              <input type="text" name="email" />
          </label>
          <br />
          <input type="submit" value="Add user" />
          <input id="closeButton" type="button" onClick={props.onClick} value="Close" />
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


