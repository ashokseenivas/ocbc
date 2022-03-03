import React, {useState,ReactNode} from 'react';
import utilities, {AuthContextType} from '../utilities';
import { Dialog, AutoCenter } from 'antd-mobile'
import { CloseCircleOutline } from 'antd-mobile-icons'

export let AuthContext = React.createContext<AuthContextType>(null!);

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
                    Dialog.alert({
                        confirmText: "OK",
                        header: (
                          <CloseCircleOutline
                            style={{
                              fontSize: 64,
                              color: 'var(--adm-color-danger)',
                            }}
                          />
                        ),
                        title: 'Error',
                        content: (
                            <>
                              <AutoCenter>System Error!</AutoCenter>
                              <AutoCenter>Please try again later.</AutoCenter>
                            </>
                          ),
                    })
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
                    Dialog.alert({
                        confirmText: "OK",
                        header: (
                          <CloseCircleOutline
                            style={{
                              fontSize: 64,
                              color: 'var(--adm-color-danger)',
                            }}
                          />
                        ),
                        title: 'Error',
                        content: (
                            <>
                              <AutoCenter>System Error!</AutoCenter>
                              <AutoCenter>Please try again later.</AutoCenter>
                            </>
                          ),
                    })
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
export function useAuth() {
    return React.useContext(AuthContext);
}