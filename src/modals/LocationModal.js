import './Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';

const LocationModal = (props) => {
    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onClick} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form onSubmit={addLocation}>
                    <label> Identifier:
                        <input type="text" id="identifier" />
                    </label>
                    <br />
                    <label> State:
                        <select id="state">
                            <option value="1">Alabama</option>
                            <option value="2">Alaska</option>
                            <option value="3">Arizona</option>
                            <option value="4">Arkansas</option>
                            <option value="5">California</option>
                            <option value="6">Colorado</option>
                            <option value="7">Connecticut</option>
                            <option value="8">Delaware</option>
                            <option value="9">Florida</option>
                            <option value="10">Georgia</option>
                            <option value="11">Hawaii</option>
                            <option value="12">Idaho</option>
                            <option value="13">Illinois</option>
                            <option value="14">Indiana</option>
                            <option value="15">Iowa</option>
                            <option value="16">Kansas</option>
                            <option value="17">Kentucky</option>
                            <option value="18">Louisiana</option>
                            <option value="19">Maine</option>
                            <option value="20">Maryland</option>
                            <option value="21">Massachusetts</option>
                            <option value="22">Michigan</option>
                            <option value="23">Minnesota</option>
                            <option value="24">Mississippi</option>
                            <option value="25">Missouri</option>
                            <option value="26">Montana</option>
                            <option value="27">Nebraska</option>
                            <option value="28">Nevada</option>
                            <option value="29">New Hampshire</option>
                            <option value="30">New Jersey</option>
                            <option value="31">New Mexico</option>
                            <option value="32">New York</option>
                            <option value="33">North Carolina</option>
                            <option value="34">North Dakota</option>
                            <option value="35">Ohio</option>
                            <option value="36">Oklahoma</option>
                            <option value="37">Oregon</option>
                            <option value="38">Pennsylvania</option>
                            <option value="39">Rhode Island</option>
                            <option value="40">South Carolina</option>
                            <option value="41">South Dakota</option>
                            <option value="42">Tennessee</option>
                            <option value="43">Texas</option>
                            <option value="44">Utah</option>
                            <option value="45">Vermont</option>
                            <option value="46">Virginia</option>
                            <option value="47">Washington</option>
                            <option value="48">West Virginia</option>
                            <option value="49">Wisconsin</option>
                            <option value="50">Wyoming</option>
                        </select>
                    </label>
                    <br />
                    <label> City:
                        <input type="text" id="city" />
                    </label>
                    <br />
                    <label> Address line 1:
                        <input type="text" id="address1" />
                    </label>
                    <br />
                    <label> Address line 2:
                        <input type="text" id="address2" />
                    </label>
                    <br />
                    <label> Type:
                        <select id="type">
                            <option value="WAREHOUSE">Warehouse</option>
                            <option value="SHOP">Shop</option>
                        </select>
                    </label>
                    <br />
                    <label> Total capacity:
                        <input type="text" id="total_capacity" />
                    </label>
                    <br />
                    <label> Available capacity:
                        <input type="text" id="available_capacity" />
                    </label>
                    <br />
                    <label> Location tax:
                        <input type="text" id="location_tax" />
                    </label>
                    <br />
                    <input type="submit" value="Add customer" />
                    <input type="button" onClick={props.onClick} value="Close" />
                </form>
            </div>
        </div>
    )
}

function addLocation(e) {
    e.preventDefault();
    fetch('http://localhost:8080/locations', {
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            identifier: e.target.identifier.value,
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
            totalCapacity: e.target.total_capacity.value,
            availableCapacity: e.target.available_capacity.value,
            locationType: e.target.type.value,
            locationTax: e.target.location_tax.value
        }),
        method: "POST"
    });
}

export default LocationModal;