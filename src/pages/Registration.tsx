import React, { useState } from 'react';
import { Button, Form, Input, Space, NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/Auth';
import { FormInstance } from 'antd-mobile/es/components/form'

const Registration = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    let formRef = React.createRef<FormInstance>();
    const [form] = Form.useForm();
    let auth = useAuth();
    let navigate = useNavigate();
    const onFinish = () => {
        formRef.current?.validateFields().then(values => {
            auth.signup(username, password, ()=>{
                navigate("/");
            });
        }).catch(err=>{})
    }
    
    const checkConfirmPassword = () => {
        if (confirmPassword !== password) {
            return Promise.reject('Confirm password not match');
        }
        return Promise.resolve();
      };
    const back = () => {
        navigate("/login");
    }
    return (
        <Layout>
            <>
                <NavBar onBack={back}>Register</NavBar>
                <Form ref={formRef} form={form}>
                    <Form.Item
                        name='username'
                        label='Username'
                        rules={[{ required: true, message: 'Username is required' }]}
                    >
                        <Input placeholder='Username' autoComplete='off' onChange={val => setUserName(val)} />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        label='Password'
                        rules={[{ required: true, message: 'Password is required' }]}
                    >
                        <Input type='password' autoComplete='off' placeholder='Password' onChange={val => setPassword(val)} />
                    </Form.Item>
                    <Form.Item
                        name='confirmPassword'
                        label='Confirm Password'
                        rules={[{ required: true, message: 'Confirm Password is required' }, {validator: checkConfirmPassword, message: 'Confirm password not match'}]}
                    >
                        <Input type='password' autoComplete='off' placeholder='Confirm Password' onChange={val => setConfirmPassword(val)} />
                    </Form.Item>
                </Form>
                <div className="footer">
                    <Space direction="vertical" block>
                        <Button block onClick={onFinish} data-testid="register" shape='rounded' type='submit' color='primary' size='large'>
                            Register
                        </Button>
                    </Space>
                </div>
            </>
        </Layout>
    );
};

export default Registration;