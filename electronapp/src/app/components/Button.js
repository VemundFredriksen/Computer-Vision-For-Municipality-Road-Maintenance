import React from "react";

import './Button.css'

const Button = ({ text, onClick=null }) => {
    return (
        <button type="button" className='button' onClick={onClick}>{text} </button>

    )
}

export default Button