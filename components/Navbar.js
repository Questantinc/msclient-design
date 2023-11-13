import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './images/Logo.png'

function Navbar() {
    const [showApprovals, setShowApprovals] = useState(false);
    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/Home">
                    <img src={Logo} alt="Company Logo" />
                </Link>
            </div>
            <ul>
                <li>
                    <Link to="/Home">Cost Summary</Link>
                </li>
                <li>
                    <Link to="/FutureForecast">Future Forecast</Link>
                </li>
                <li>
                    <Link to="/POTable">Purchase Orders</Link>
                </li>
                <li>
                    <Link to="/NonPOTable">Non PO </Link>
                </li>
                <li>
                    <Link to="/Invoices">Invoices</Link>
                </li>
             
                <li>
                    <Link to="/UpdatesTable">Updates </Link>
                </li>

                <li className="nav-dropdown">
                    <a href="/" className="nav-dropbtn">
                        Forecast Move Request
                    </a>
                    <div className="nav-dropdown-content">
                        <Link to="/Requests">Submit Request</Link>
                        <div onClick={() => setShowApprovals(!showApprovals)}>
                            <span style={{ color: 'white', font: 'caption', fontFamily: 'monospace', fontWeight: 'bold' }}>Request Approval</span>
                            {showApprovals ? (
                                <span style={{ color: 'white' }} className="caret">▲</span>
                            ) : (
                                <span style={{ color: 'white' }} className="caret">▼</span>
                            )}
                        </div>
                        {showApprovals && (
                            <>
                                <Link to="/simon-approvals">Simon Approvals</Link>
                                <Link to="/derek-approvals">Derek Approvals</Link>
                                <Link to="/nick-approvals">Nick Approvals</Link>
                                <Link to="/neil-approvals">Neil Approvals</Link>
                            </>
                        )}
                    </div>
                </li>

                <li>
                    <Link to="/">Logout</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
