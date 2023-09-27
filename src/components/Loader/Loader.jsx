import React from 'react'
import loader from '../../assets/condition_icons/loader.png'
import ReactDOM from "react-dom";
import './Loader.css'

const Loader = () => {
  return ReactDOM.createPortal(
    <img src={loader} alt="Loading.." className='loading' />,
    document.getElementById("loading")
  );
}

export default Loader