import { useDashboardContext } from '../pages/DashboardLayout';
import links from '../utils/links';
import { NavLink } from 'react-router-dom';
import React from 'react'

const NavLinks = ({ isBigSidebar }) => {
    const { toggleSidebar, user } = useDashboardContext();
    return (
        <div className="nav-links">
            {links.map((link) => {
                const { text, path, icon } = link;
                const {role} = user;
                if(path === 'admin' && role !== 'admin') return;
                return <NavLink
                    to={path}
                    key={text}
                    className="nav-link"
                    onClick={isBigSidebar ? null : toggleSidebar}
                    end //addjob doesnt get activeclass unless we navigate to that page
                >
                    <span className='icon'>{icon}</span>{text}

                </NavLink>
            })}
        </div>
    )
}

export default NavLinks
