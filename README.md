## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn test`

Launches the test runner in the interactive watch mode.\

### `yarn test-cov`

Launches the test runner in the interactive watch mode, with coverage.\


## Understand the code

This app comes with 4 screens.
    1. Login
    2. Register
    3. Dashboard
    4. Transfer

Login & Register screens are public and its not protected.
Dashboard & Transfer screens are protected, means user needs to login or register to see the screens.

All authenticated & logout methods are maintained in utilities.ts
```
...
export default {
    async fetch(url: string) {
        return await fetch(`${API_BASE_URL}${url}`, {
            method: 'GET',
            headers: headers()
            }).then(parseResponse)
    },
    async post(url: string, data: any) {
        const body = JSON.stringify(data)
        return await fetch(`${API_BASE_URL}${url}`, {
          method: 'POST',
          headers: headers(),
          body
        }).then(parseResponse)
    }
    ...
}
```

All authentication and managing tokens are maintaining context/Auth.tsx.
Protecting Dashboard and Transfer pages without token or expired tokens are maintained in components/Auth.tsx
```
//context/Auth.tsx
export function AuthProvider({ children }: { children: ReactNode }) {
    let [isAuthenticated, setIsAuthenticated] = useState<boolean>(sessionStorage.getItem('token') !== null && sessionStorage.getItem('token') !== "");
    const [name, setName] = useState<string|null>((sessionStorage.getItem('name') !== null && sessionStorage.getItem('name') !== "") ? sessionStorage.getItem('name') : "" );
    let signin = async (username: string, password: string, callback: VoidFunction) => {
        if(username === null || username === "" || password === null || password === ""){ return null; }
        return utilities.post("/login", {username, password})
                .then(data => {
                    sessionStorage.setItem('token', JSON.stringify(data.token))
                    sessionStorage.setItem('name', data.username)
                    setName(data.username);
                    setIsAuthenticated(true);
                    callback();
                })
                .catch(err=>{
                    ...
                })
    };
    let signup = async (username: string, password: string, callback: VoidFunction) => {
        return utilities.post("/register", {username, password})
                .then(data => {
                    sessionStorage.setItem('token', JSON.stringify(data.token))
                    sessionStorage.setItem('name', username)
                    setName(username);
                    setIsAuthenticated(true);
                    callback();
                })
                .catch(err=>{
                    ...
                })
    };
    let signout = (callback: VoidFunction) => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('name');
        setIsAuthenticated(false);
        setName("");
        callback();
    };
    let value = { name, isAuthenticated, signup, signin, signout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
//components/Auth.tsx
export function Auth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();
    if (!auth.isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} />;
    }
    return children;
}
```

All screens are accessed via URL, which are maintained in App.tsx

```
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
```

