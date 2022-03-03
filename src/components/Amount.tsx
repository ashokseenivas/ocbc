import React from 'react';
import utilities from '../utilities'

const Amount = ({ children }: { children: number }) => {
    
    const formattedAmount = utilities.amountFormat(children, 2);
    const amount = children > 0 ? <b className="green">{formattedAmount}</b> : <b className="gray">{formattedAmount}</b>;
    return (
        <div className="right">
            {amount}
        </div>
    );
};

export default Amount;