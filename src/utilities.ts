export const APP_CURRENCY = "SGD"
const API_BASE_URL = "https://green-thumb-64168.uc.r.appspot.com"
//const API_BASE_URL = "http://192.168.0.108:3001"
const HTTP_STATUS_CREATED = 201
const HTTP_STATUS_NO_CONTENT = 204
const HTTP_STATUS_UNAUTHORIZED = 401
const ValidateAuthentication = (response: any) => {
    if (response.status === HTTP_STATUS_UNAUTHORIZED) {
        window.location.href = "/login?expired=false"
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("name")
        return false
    }
    return true
}
interface Receipient {
    accountHolder: string;
    accountNo: string;
}
export interface Payee {
    id: string;
    name: string;
    accountNo: string;
}
export interface AuthContextType {
    name: string|null;
    isAuthenticated: boolean;
    signup: (username: string, pasword: string, callback: VoidFunction) => void;
    signin: (username: string, pasword: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}
export interface Transaction {
    amount: number;
    description: string;
    sender?: Receipient;
    receipient?: Receipient;
    transactionDate: string;
    transactionId: string;
    transactionType: string;
}
const headers = () => {
    const token = sessionStorage.getItem('token')
    let headers:any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    if(token !== null){
        headers["Authorization"] = JSON.parse(token)
    }
    return headers
}

const parseResponse = (response: any) => {
    if(ValidateAuthentication(response)) {
        if(response.ok && (response.status === HTTP_STATUS_CREATED ||
            response.status === HTTP_STATUS_NO_CONTENT)) {
                return response.json().then((json: any) => {
                    if (!response.ok) {
                      return Promise.reject(json)
                    }
                    return json
                })
            }
        return response.json().then((json: any) => {
            if (!response.ok) {
              return Promise.reject(json)
            }
            return json
        })
    }
}
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
    },
    dateFormat(dt: string) {
        let date = new Date(dt);
        let strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let d = date.getDate();
        let m = strArray[date.getMonth()];
        let y = date.getFullYear();
        return (d <= 9 ? '0' + d : d) + ' ' + m + ' ' + y;
    },
    amountFormat(amount: number, decimals: number) {
        let parts = amount.toFixed(decimals).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
}