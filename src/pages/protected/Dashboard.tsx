import React, {useEffect,useState} from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Space, NavBar, Card, List, Empty } from 'antd-mobile'
import Layout from '../../components/Layout';
import Amount from '../../components/Amount';
import { useAuth } from '../../contexts/Auth';
import utilities, {APP_CURRENCY, Transaction} from '../../utilities';
import PowerOff from '../../assets/images/power-off.svg';

const Dashboard = () => {
    const [accountNo, setAccountNo] = useState("");
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    let auth = useAuth();
    let navigate = useNavigate();
    const right = <Link to="" onClick={() => {auth.signout(() => navigate("/"));}}><img src={PowerOff} className="logout" alt="Logout" /></Link>
    const redirectTransfer = () => {
        navigate("/transfer");
    }
    useEffect(() => {
        utilities.fetch("/balance")
            .then(data => {
                if(data && data.status === "success"){
                    setBalance(data.balance);
                    setAccountNo(data.accountNo);
                }
            })
        utilities.fetch("/transactions")
            .then(data => {
                if(data && data.status === "success"){
                    const groupedDate = data.data.reduce((acc: any, val:Transaction)=>{
                        if(val !== null && val.transactionDate !== null){
                            const date = val.transactionDate.substring(0,10)
                            const item = acc.find((i:any)=>i.date.match(new RegExp(date, "g")))
                            if(!item) {
                                acc.push({date, list:[val]})
                            } else {
                                item.list.push(val)
                            }
                        }
                        return acc;
                    },[])
                    setTransactions(groupedDate);
                }
            })
    },[]);
    return (
        <Layout>
            <div>
                <NavBar back={null} right={right}>Dashboard</NavBar>
                <Card className="hero">
                    <h2 className="embossed">{auth.name}</h2>
                    <h2 className="embossed">{accountNo}</h2>
                    <div className="mt10">Balance</div>
                    <h2 className="embossed mt1">{APP_CURRENCY} {utilities.amountFormat(balance,2)}</h2>
                </Card>
                <div className="body">
                <h3 className="pl2">Your transaction history</h3>
                    {transactions && transactions.length > 0 && <>{
                        transactions.map((item: any, index: number) =>{
                                return (
                                    item.list && 
                                    item.list.length > 0 && 
                                    <List key={index} header={utilities.dateFormat(item.date)} style={{backgroundColor: '#eee'}}>
                                        {item.list.map((item: Transaction)=>{
                                            return (
                                                item.receipient !== undefined && 
                                                item.receipient !== null  
                                                    ?  
                                                    <List.Item key={item.transactionId} description={item.receipient?.accountNo}>
                                                        <div className="mb1"><b>{item.receipient?.accountHolder}</b></div>
                                                        <Amount>{-item.amount}</Amount>
                                                    </List.Item> 
                                                    : 
                                                    <List.Item key={item.transactionId} description={item.sender?.accountNo}>
                                                        <div className="mb1"><b>{item.sender?.accountHolder}</b></div>
                                                        <Amount>{item.amount}</Amount>
                                                    </List.Item>
                                            )
                                        })}
                                    </List>
                                )
                        })
                        
                    }</>
                    }
                    {transactions && transactions.length === 0 && <Empty description='No Transactions' />}
                </div>
                
                <div className="footer">
                    <Space direction="vertical" block>
                        <Button block onClick={redirectTransfer} shape='rounded' type='submit' color='primary' size='large'>
                            Make Transfer
                        </Button>
                    </Space>
                </div>
            </div>
        </Layout>
        
    );
};

export default Dashboard;