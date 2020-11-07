import './Modal.css';
import ReactDom from 'react-dom';
import React, { useState, useEffect } from 'react';


const UserModal = (props) => {
        return(
            <div className={"modal-wrapper"}>
                <div onClick={props.onClose} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                {props.children}
                </div>
            </div>
        )
}

export default UserModal;


