import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { userModal } from './'

const UserModal = (props) => {
    const [display, setDiplay] = useState(true)

    const open = () => {
        setDisplay(true)
      };
    
      const close = () => {
        setDisplay(false);
      };

      if (display) {
        return(
            <div className={"modal-wrapper"}>
                <div onClick={close} className={"modal-backdrop"}/>
                <div className={"modal-box"}>
                    {props.children}
                </div>
            </div>
        )
      }
      return null;

};

