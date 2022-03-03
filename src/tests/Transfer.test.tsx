import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Button, Form, Input, Space, NavBar } from 'antd-mobile'
import { BrowserRouter as Router } from 'react-router-dom';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { AuthContext } from '../contexts/Auth';
import Transfer from '../pages/protected/Transfer';

Enzyme.configure({ adapter: new Adapter() });
let data = {
  name: 'Seeni',
  isAuthenticated: true,
  signup: jest.fn(),
  signin: jest.fn(),
  signout: jest.fn()
}
let transferData = {
  payee: "6554-630-9653",
  amount: 200.50,
  description: "Testing transfer"
}
test('Is Transfer Component Rendered?', () => {
  data.isAuthenticated = false;
  const wrapper = render(<Router><AuthContext.Provider value={data}><Transfer /></AuthContext.Provider></Router>);
  const transferHeader = screen.getByText("Transfer", {selector: 'div'});
  const payeeLabel = screen.getByText("Payee");
  const amountLabel = screen.getByText("Amount");
  const descriptionLabel = screen.getByText("Description");
  const registerButton = screen.getByText("Transfer Now", {selector: 'button'});
  expect(transferHeader).toBeInTheDocument();
  expect(payeeLabel).toBeInTheDocument();
  expect(amountLabel).toBeInTheDocument();
  expect(descriptionLabel).toBeInTheDocument();
  expect(registerButton).toBeInTheDocument();
  wrapper.unmount();
});

test('Registration validation with errors', async () => {
  data.isAuthenticated = false;
  const transfer = mount((<Router><AuthContext.Provider value={data}><Transfer /></AuthContext.Provider></Router>));
  const form = transfer.find(Form).props().form;
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
  transfer.unmount();
});

test('Registration validation without errors', async () => {
  data.isAuthenticated = false;
  const transfer = mount(<Router><AuthContext.Provider value={data}><Transfer /></AuthContext.Provider></Router>);
  const form = transfer.find(Form).props().form;
  form?.setFieldsValue(transferData);
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
  transfer.unmount();
});
  