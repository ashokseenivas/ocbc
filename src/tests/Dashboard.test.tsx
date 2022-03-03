import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../pages/protected/Dashboard';
import { Auth } from '../components/Auth';
import { AuthContext } from '../contexts/Auth';

let data = {
  name: 'Seeni',
  isAuthenticated: false,
  signup: jest.fn(),
  signin: jest.fn(),
  signout: jest.fn()
}
  
test('Is Dashboard Component Rendered?', () => {
  data.isAuthenticated = true;
  render(<Router><AuthContext.Provider value={data}><Auth><Dashboard /></Auth></AuthContext.Provider></Router>);
  const dashboardHeader = screen.getByText("Dashboard");
  const name = screen.getByText(data.name);
  const historyLabel = screen.getByText("Your transaction history");
  const transferBtn = screen.getByText("Make Transfer", {selector: 'button'});
  expect(dashboardHeader).toBeInTheDocument();
  expect(name).toBeInTheDocument();
  expect(historyLabel).toBeInTheDocument();
  expect(transferBtn).toBeInTheDocument();
});

test('Dashboard empty transactions', () => {
  data.isAuthenticated = true;
  const el = render(<Router><AuthContext.Provider value={data}><Auth><Dashboard /></Auth></AuthContext.Provider></Router>);
  const balanceText = screen.getByText("SGD 0.00");
  expect(balanceText).toBeInTheDocument();
  const noTransactions = screen.getByText("No Transactions");
  expect(noTransactions).toBeInTheDocument();
});