import React from 'react';
import './Button.css';

const Button = (props) => {
  let classes = "button " + props.btnType;
  return (
    <button
      className={classes}
      disabled={props.disabled}
      onClick={props.clicked} >
      {props.children}
    </button>
  );
};

export default Button;
