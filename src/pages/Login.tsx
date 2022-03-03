import React, { useState, useEffect, createRef } from 'react';
import { Button, Form, Input, Space, NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/Auth';
import Layout from '../components/Layout';
import { FormInstance } from 'antd-mobile/es/components/form'

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    let auth = useAuth();
    let navigate = useNavigate();
    let formRef = createRef<FormInstance>();
    const [form] = Form.useForm();
    useEffect(() => {
        if(auth.isAuthenticated){
            navigate("/");
        }
    });
    const onFinish = () => {
        formRef.current?.validateFields().then(values => {
            auth.signin(username, password, ()=>{
                navigate("/");
            });
        }).catch(err => {})
    }
    const registration = () => {
        navigate("/registration");
    }
    return (
        <Layout>
            <>
                <NavBar className="white" back={null}>Login</NavBar>
                <Form ref={formRef} form={form}>
                    <Form.Item
                        name='username'
                        label='Username'
                        rules={[{ required: true, message: 'Username is required' }]}
                    >
                        <Input placeholder='Username' data-testid="username" autoComplete='off' onChange={val => setUserName(val)} />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        label='Password'
                        rules={[{ required: true, message: 'Password is required' }]}
                    >
                        <Input type='password' placeholder='Password' data-testid="password" autoComplete='off' onChange={val => setPassword(val)} />
                    </Form.Item>
                </Form>
                <div className="footer">
                    <Space direction="vertical" block>
                        <Button onClick={onFinish} data-testid="login" block shape='rounded' type='submit' color='primary' size='large'>
                            Login
                        </Button>
                        <Button onClick={registration} data-testid="register" block shape='rounded' type='button' fill='outline' color='primary' size='large'>
                            Register
                        </Button>
                    </Space>
                </div>
            </>
        </Layout>
    );
};

export default Login;