import React from 'react'
import styled from 'styled-components';
import Wrapper from '../assets/wrappers/LandingPage'
import main from "../assets/images/main.svg"
import { Link } from "react-router-dom"
import { Logo } from '../components';
const Landing = () => {
    return (<Wrapper>
        <nav >
            <Logo />
        </nav>
        <div className='container page'>
            <div className="info">
                <h1>job <span>tracking</span> app</h1>
                <p> I'm baby everyday carry viral narwhal, mixtape actually fashion axe XOXO ugh try-hard you probably haven't heard of them small batch next level banh mi DIY. Roof party vaporware shaman mukbang actually. Messenger bag pinterest venmo, kombucha keytar grailed migas stumptown small batch kinfolk green juice. Venmo waistcoat yes plz solarpunk, vaporware trust fund next level cronut yuccie. Literally truffaut dreamcatcher tbh bodega boys affogato art party JOMO. Keytar offal gentrify celiac neutral milk hotel XOXO vegan ethical skateboard tousled plaid shaman quinoa lomo. Fixie raw denim cupping food truck, twee pug actually blackbird spyplane green juice bespoke four dollar toast pour-over ascot pitchfork offal.</p>
                <Link to="/register"
                    className="btn register-link">
                    Register
                </Link>
                <Link to="/login"
                    className="btn">
                    Login / Demo User
                </Link>
            </div>
            <img src={main} alt="Job Hunt" className='img main-img' />
        </div>
    </Wrapper>
    )
}

export default Landing
