import './Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';

const BillModal = (props) => {
  return (
      <div className={"modal-wrapper"}>
        <div onClick={props.onClick} className={"modal-backdrop"} />
        <div className={"modal-box"}>
          <form>
            <label> Bill number:
              <input type="text" name="billNumber" />
            </label>
            <br/>
            <label> Location identifier:
              <input type="text" name="locationId" />
            </label>
            <br/>
            <label> Manager information:
              <input type="text" name="managerInformation" />
            </label>
            <br/>
            <label> Registration date and time:
              <input type="text" name="units" />
            </label>
            <br/>
            <label> Item UPC:
              <input type="text" name="itemUpc" />
            </label>
            <br/>
            <label> Amount:
              <input type="text" name="amount" />
            </label>
            <br/>
            <label> Price:
              <input type="text" name="price" />
            </label>
            <br/>
            <label> Total amount of items:
              <input type="text" name="totalItemAmount" />
            </label>
            <br/>
            <label> Total volume:
              <input type="text" name="totalItemVolume" />
            </label>
            <br/>
            <input type="submit" value="Add bill" />
            <input type="button" onClick={props.onClick} value="Close" />
          </form>
        </div>
      </div>
  )
}

export default BillModal;
