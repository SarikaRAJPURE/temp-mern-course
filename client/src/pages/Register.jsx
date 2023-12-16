import React from 'react'
import { Form, redirect, Link } from 'react-router-dom'
import Wrapper from "../assets/wrappers/RegisterAndLoginPage"
import { Logo, SubmitBtn } from '../components'
import FormRow from '../components/FormRow'
import customFetch from '../utils/customFetch'
import { toast } from "react-toastify";


// form action to submit data to server
export const action = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);//converts array of arrays into object
    console.log(data);
    try {
        await customFetch.post('/auth/register', data);
        toast.success("Registration successful");
        return redirect('/login');
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.msg);
        return error;
    }
}

const Register = () => {

    const isSubmitting = navigation.state === 'submitting'
    return (
        <Wrapper>
            <Form method='post' className='form'>
                <Logo />
                <h4>Register</h4>
                <FormRow
                    type="text"
                    name="name" />
                <FormRow
                    type="text"
                    name="lastName"
                    labelText="last name" />
                <FormRow
                    type="text"
                    name="location" />
                <FormRow
                    type="email"
                    name="email" />
                <FormRow
                    type="password"
                    name="password" />
                <SubmitBtn />
                <p>
                    Already a member?
                    <Link className='member-btn' to="/login">Login</Link>
                </p>
            </Form>
        </Wrapper >

    )
}

export default Register
