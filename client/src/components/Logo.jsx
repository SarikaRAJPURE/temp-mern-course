import logo from "../assets/images/logo.svg"
import { Link } from "react-router-dom"
import React from 'react'
const Logo = () => {
    return (<>
        <Link to="/">
            <img src={logo} alt="Jobify" className='logo' />
        </Link>
    </>
    )
}

export default Logo
