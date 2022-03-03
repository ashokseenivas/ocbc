import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Button, Form, Input, Space, NavBar } from 'antd-mobile'
import { BrowserRouter as Router } from 'react-router-dom';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { AuthContext } from '../contexts/Auth';
import Registration from '../pages/Registration';

Enzyme.configure({ adapter: new Adapter() });
let data = {
  name: 'Seeni',
  isAuthenticated: false,
  signup: jest.fn(),
  signin: jest.fn(),
  signout: jest.fn()
}
let registrationData = {
  username: "seeni",
  password: "test",
  confirmPassword: "test"
}
test('Is Registration Component Rendered?', () => {
  data.isAuthenticated = false;
  const wrapper = render(<Router><AuthContext.Provider value={data}><Registration /></AuthContext.Provider></Router>);
  const loginHeader = screen.getByText("Register", {selector: 'div'});
  const usernameLabel = screen.getByText("Username");
  const passwordLabel = screen.getByText("Password");
  const confirmPasswordLabel = screen.getByText("Confirm Password");
  const registerButton = screen.getByText("Register", {selector: 'button'});
  expect(loginHeader).toBeInTheDocument();
  expect(usernameLabel).toBeInTheDocument();
  expect(passwordLabel).toBeInTheDocument();
  expect(confirmPasswordLabel).toBeInTheDocument();
  expect(registerButton).toBeInTheDocument();
  wrapper.unmount();
});

test('Registration validation with errors', async () => {
  data.isAuthenticated = false;
  const registration = mount((<Router><AuthContext.Provider value={data}><Registration /></AuthContext.Provider></Router>));
  const form = registration.find(Form).props().form;
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
  expect(errorCount).toEqual(3);
  registration.unmount();
});

test('Registration validation without errors', async () => {
  data.isAuthenticated = false;
  const registration = mount((<Router><AuthContext.Provider value={data}><Registration /></AuthContext.Provider></Router>));
  const form = registration.find(Form).props().form;
  form?.setFieldsValue(registrationData);
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
  registration.unmount();
});
  