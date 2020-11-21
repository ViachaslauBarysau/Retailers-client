import React, {useState} from "react";

const Test = () => {
    let [state, setState] = useState(1);

    let editState = () => {
        setState((prev) => (prev + 1));
    };

    return (
        <div>
            {"State = " + state}
            <button onClick={editState}/>
        </div>
    )
};

export default Test;