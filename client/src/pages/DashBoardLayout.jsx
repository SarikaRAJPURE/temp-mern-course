import React, { useState, createContext, useContext } from 'react'
import { Outlet, redirect, useLoaderData, useNavigate } from 'react-router-dom'
import Wrapper from '../assets/wrappers/Dashboard'
import { SmallSidebar, BigSidebar, Navbar } from "../components"
import { checkDefaultTheme } from '../App'
import customFetch from '../utils/customFetch'
import { toast } from 'react-toastify'

//to load user data before page renders
export const loader = async () => {
    try {
        const { data } = await customFetch.get("/users/current-user");
        console.log(data);
        return data;
    } catch (error) {
        return redirect("/");
    }
}

const DashBoardContext = createContext();

const DashBoardLayout = () => {
    //const  data  = useLoaderData();
    const { user } = useLoaderData();
    const navigate = useNavigate();
    console.log(user);
    //console.log(checkDefaultTheme());
    //temp
    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
    //console.log("isDarkTheme: " + isDarkTheme);
    const toggleDarkTheme = () => {
        const newDarkTheme = !isDarkTheme;
        setIsDarkTheme(newDarkTheme);
        document.body.classList.toggle('dark-theme', newDarkTheme);
        localStorage.setItem('darkTheme', newDarkTheme);
        console.log('toggle dark theme');
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    }

    const logoutUser = async () => {
        navigate("/");
        await customFetch.get("/auth/logout");
        toast.success("Logging out...");
    };
    return (
        <DashBoardContext.Provider value={{
            user,
            showSidebar,
            isDarkTheme,
            toggleDarkTheme,
            toggleSidebar,
            logoutUser
        }}>
            <Wrapper>
                <main className="dashboard">
                    <SmallSidebar />
                    <BigSidebar />
                    <div>
                        <Navbar />
                        <div className="dashboard-page">
                            {/* pass user object to all components inside outlet */}
                            <Outlet context={{ user }} />
                        </div>
                    </div>
                </main>
            </Wrapper>
        </DashBoardContext.Provider>
    );
};
export const useDashboardContext = () => useContext(DashBoardContext);
export default DashBoardLayout
