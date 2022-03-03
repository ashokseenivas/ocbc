import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Button, Form, Input, Space, NavBar } from 'antd-mobile'
import { BrowserRouter as Router } from 'react-router-dom';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
Enzyme.configure({ adapter: new Adapter() });
import { AuthContext } from '../contexts/Auth';
import Login from '../pages/Login';

jest.useFakeTimers();
let data = {
  name: 'Seeni',
  isAuthenticated: false,
  signup: jest.fn(),
  signin: jest.fn(),
  signout: jest.fn()
}
let loginData = {
  username: "seeni",
  password: "test"
}
test('Is Login Component Rendered?', () => {
  data.isAuthenticated = false;
  const wrapper = render(<Router><AuthContext.Provider value={data}><Login /></AuthContext.Provider></Router>);
  const loginHeader = screen.getByText("Login", {selector: 'div'});
  const usernameLabel = screen.getByText("Username");
  const passwordLabel = screen.getByText("Password");
  const loginButton = screen.getByText("Login", {selector: 'button'});
  const registerButton = screen.getByText("Register");
  expect(loginHeader).toBeInTheDocument();
  expect(usernameLabel).toBeInTheDocument();
  expect(passwordLabel).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  expect(registerButton).toBeInTheDocument();
  wrapper.unmount();
});

test('Login validation with errors', async () => {
  data.isAuthenticated = false;
  const login = mount((<Router><AuthContext.Provider value={data}><Login /></AuthContext.Provider></Router>));
  const form = login.find(Form).props().form;
  await form?.validateFields()
    .then(values => {})
    .catch(err=>{});
  
  const errors = form?.getFieldsError();
  let errorCount = 0;
  errors?.forEach((error) => {
    if(error.errors.length){
      errorCount++;
    }
  });
  expect(errorCount).toEqual(2);
  login.unmount();
});

test('Login validation without errors', async () => {
  data.isAuthenticated = false;
  const login = mount((<Router><AuthContext.Provider value={data}><Login /></AuthContext.Provider></Router>));
  const form = login.find(Form).props().form;
  form?.setFieldsValue(loginData);
  await form?.validateFields()
    .then(values => {})
    .catch(err=>{});

  const errors = form?.getFieldsError();
  let errorCount = 0;
  errors?.forEach((error) => {
    if(error.errors.length){
      errorCount++;
    }
  });
  expect(errorCount).toEqual(0);
  login.unmount();
});
  