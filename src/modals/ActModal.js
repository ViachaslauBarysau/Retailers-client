import './Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';

const ActModal = (props) => {
    return (
        <div className={"modal-wrapper"}>
            <div onClick={props.onClick} className={"modal-backdrop"} />
            <div className={"modal-box"}>
                <form>
                    <label> Item upc:
                        <input type="text" name="itemUpc" />
                    </label>
                    <br />
                    <label> Amount:
                        <input type="text" name="amount" />
                    </label>
                    <br />
                    <label> Reason:
                         <input type="text" name="reason" />
                    </label>
                    <br />
                    <label> Date and time:
                        <input type="text" name="date" />
                    </label>
                    <br />
                    <label> Total sum of items:
                        <input type="text" name="sum" />
                    </label>
                    <br />
                    <input type="submit" value="Add act" />
                    <input type="button" onClick={props.onClick} value="Close" />
                </form>
            </div>
        </div>
    )
}

export default ActModal;
