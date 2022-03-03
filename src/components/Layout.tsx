import React from 'react';

const Layout = ({ children }: { children: JSX.Element }) => {
    return (
        <div className="container">
            {children}
        </div>
    );
};

export default Layout;