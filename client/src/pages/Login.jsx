import React from 'react'
import {
    Link,
    Form,
    redirect,
    useActionData,
    useNavigate
} from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitBtn } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

//login user functionality

export const action = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(data.password);
    //before we make request to server check for errors
    const errors = { msg: "" };
    if (data.password.length < 8) {
        console.log(data.password.length);
        errors.msg = "password too short";
        console.log(errors);
        return errors;
    }
    try {
        await customFetch.post("/auth/login", data);
        toast.success("Login successful");
        return redirect("/dashboard");
    } catch (error) {
        //console.log(error);
        //toast.error(error?.response?.data?.msg);
        errors.msg = error?.response?.data?.msg;
        return errors;
    }
};

const Login = () => {
    //for redirecting inside component
    const navigate = useNavigate();

    //function for login user for demo
    const loginDemoUser = async () => {
        //provide test users login credentials email and password for demo
        const data = {
            email: "test@test.com",
            password: "secret123"
        }
        //for test user
        try {
            await customFetch.post("/auth/login", data);
            toast.success("Login successful for Demo");
            navigate("/dashboard");
        } catch (error) {
            errors.msg = error?.response?.data?.msg;
        }
    }

    const errors = useActionData();
    console.log(errors);

    return (<Wrapper>
        <Form method='post' className='form'>
            <Logo />
            <h4>Login</h4>
            {errors && (<p style={{ color: "red" }}> {errors.msg}</p>)}
            <FormRow type="email" name="email" />
            <FormRow type="password" name="password" />
            <SubmitBtn />
            <button type="button" className='btn btn-block' onClick={loginDemoUser}>
                explore the app
            </button>
            <p>
                Not a member  yet?
                <Link className='member-btn' to="/register">Register</Link>
            </p>
        </Form>
    </Wrapper>
    )
}

export default Login
