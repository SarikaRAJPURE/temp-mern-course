import React from 'react'
import { FormRow, SubmitBtn } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { redirect, useOutletContext } from "react-router-dom";
import { Form } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
    const formData = await request.formData();
    //we are gonna send file as form data and not as json

    //setup check on frontend to make sure 
    //we are not passing in file bigger than 0.5 MB
    const file = formData.get("avatar");
    if (file && file.size > 500000) {
        console.log(file, file.size);
        toast.error("Image size too large");
        return null;
    }
    try {
        await customFetch.patch("/users/update-user", formData);
        toast.success("Profile updated successfully");
    } catch (error) {
        toast.error(error?.response?.data?.msg);
    }
    return null;
};

const Profile = () => {
    const { user } = useOutletContext();
    const { name, lastName, email, location } = user

    return (
        <Wrapper>
            <Form method='post' className='form' encType="multipart/form-data">
                <h4 className='form-title'>
                    profile
                </h4>
                <div className="form-center">
                    {/* file input  accept only image file  
                    //we are not gonna send our image as json we actually have to send it entire form data 
                    // <div className="form-row" encType="multipart/form-data">
                    */}
                    <div className="form-row" >
                        <label htmlFor="avatar" className='form-label'>
                            select an image file (max 0.5mb)
                        </label>
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            className="form-input"
                            accept="image/*"
                        />
                    </div>
                    <FormRow type="text" name="name" defaultValue={name} />
                    <FormRow type="text" name="lastName" defaultValue={lastName} />
                    <FormRow type="email" name="email" defaultValue={email} />
                    <FormRow type="text" name="location" defaultValue={location} />
                    <SubmitBtn formBtn />
                </div>
            </Form>
        </Wrapper>
    )
}

export default Profile
