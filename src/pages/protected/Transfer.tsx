import React, { useState, useEffect, useRef, createRef } from 'react';
import { useNavigate } from 'react-router'
import { Button, Space, NavBar, Form, Input, TextArea, Dialog, AutoCenter, Dropdown, Radio } from 'antd-mobile'
import { CheckCircleOutline } from 'antd-mobile-icons'
import Layout from '../../components/Layout';
import utilities, { Payee } from '../../utilities';
import { DropdownRef } from 'antd-mobile/es/components/dropdown'
import { FormInstance } from 'antd-mobile/es/components/form'

const Transfer = () => {
    const [amount, setAmount] = useState("");
    const [payees, setPayees] = useState([]);
    const [payee, setPayee] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const ref = useRef<DropdownRef>(null);
    
    let formRef = createRef<FormInstance>();
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const submit = () => {
        formRef.current?.validateFields().then(values => {
            const data = {
                "receipientAccountNo": payee,
                "amount": parseFloat(amount),
                "description": description
            }
            utilities.post("/transfer", data)
                .then(data => {
                    if(data && data.status === "success"){
                        Dialog.alert({
                            confirmText: "OK",
                            onConfirm: ()=>{
                                navigate("/")
                            },
                            header: (
                              <CheckCircleOutline
                                style={{
                                  fontSize: 64,
                                  color: 'var(--adm-color-success)',
                                }}
                              />
                            ),
                            title: 'Info',
                            content: (
                                <>
                                  <AutoCenter>Amount successfully transferred</AutoCenter>
                                </>
                              ),
                        })
                    }
                })
        }).catch(err => {
        })
        
    };
    useEffect(() => {
        utilities.fetch("/payees")
            .then(data => {
                if(data && data.status === "success"){
                    setPayees(data.data);
                }
            })
    },[]);
    const back = () => {
        navigate("/");
    }
    const checkCombo = (rule: any, value: any) => {
        if (value === undefined || value === '') {
            return Promise.reject('Payee is required');
        }
        return Promise.resolve();
    };
    const payeeLabel = (<div><span className="adm-form-item-label-required">*</span> Payee</div>)
    return (
        <Layout>
            <div>
                <NavBar onBack={back}>Transfer</NavBar>
                <Form ref={formRef} form={form}>
                    <Form.Item
                        name='payee'
                        label={payeeLabel}
                        rules={[{validator: checkCombo}]}
                    >
                        <Dropdown className="dropdown" ref={ref}>
                            <Dropdown.Item key='sorter' title={name !== '' ? name : 'Select Payee'}>
                                <div style={{ padding: 12 }}>
                                <Radio.Group onChange={(activeKey)=> {
                                        ref.current?.close()
                                        setPayee(activeKey.toString())
                                        payees.forEach((payee:Payee)=>{
                                            if(payee.accountNo === activeKey) setName(payee.name)
                                        })
                                    }}>
                                    <Space direction='vertical' block>
                                    {payees && payees.map((payee: Payee) => (
                                        <Radio key={payee.id} block value={payee.accountNo}>
                                            {payee.name}
                                        </Radio>
                                    ))}
                                    </Space>
                                </Radio.Group>
                                </div>
                            </Dropdown.Item>
                        </Dropdown>
                    </Form.Item>
                    <Form.Item
                        name='amount'
                        label='Amount'
                        rules={[{ required: true, message: 'Amount is required' }]}
                    >
                        <Input placeholder='Amount' value={amount} autoComplete='off' onChange={val => setAmount(val)} />
                    </Form.Item>
                    <Form.Item
                        name='description'
                        label='Description'
                    >
                        <TextArea placeholder='Description' autoComplete='off' value={description} onChange={val => setDescription(val)}></TextArea>
                    </Form.Item>
                </Form>
                <div className="footer">
                    <Space direction="vertical" block>
                        <Button block onClick={submit} shape='rounded' type='submit' color='primary' size='large'>
                            Transfer Now
                        </Button>
                    </Space>
                </div>
            </div>
        </Layout>
        
    );
};

export default Transfer;