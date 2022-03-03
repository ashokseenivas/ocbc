import { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import { Auth } from './components/Auth';
import { AuthProvider } from './contexts/Auth';
import Login from './pages/Login';
import Dashboard from './pages/protected/Dashboard';
import Registration from './pages/Registration';
import Transfer from './pages/protected/Transfer';
import { DotLoading } from 'antd-mobile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<DotLoading />}>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="registration" element={<Registration />} />
            <Route path="/" element={<Auth><Dashboard /></Auth>} />
            <Route path="transfer" element={<Auth><Transfer /></Auth>} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
