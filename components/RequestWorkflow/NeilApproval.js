import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Navbar from '../Navbar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function NeilApprovalsPage({ email }) {
    const [pendingNeilApprovalRequests, setPendingNeilApprovalRequests] = useState([]);
    const [completedRequests, setCompletedRequests] = useState([]);
    const [deniedRequests, setDeniedRequests] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('pending');

    useEffect(() => {
        // Fetch 'Pending Neil Approval' requests when the component mounts

        fetchData('pending');
    }, [email]);


    const fetchData = async (category) => {
        try {
            const response = await Axios.get(
                `https://44.217.202.126/api/RequestWorkflow/ApprovalPage?category=${category}`
            );

            if (category === 'pending') {
                setPendingNeilApprovalRequests(response.data);
            } else if (category === 'completed') {
                setCompletedRequests(response.data);
            } else if (category === 'denied') {
                setDeniedRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        // Fetch data when the user switches categories
        fetchData(currentCategory);
    }, [currentCategory]);

    const getRequestById = (requestId) => {
        let requestArray;

        // Determine which data array to search based on the category
        if (currentCategory === 'pending') {
            requestArray = pendingNeilApprovalRequests;
        } else if (currentCategory === 'completed') {
            requestArray = completedRequests;
        } else if (currentCategory === 'denied') {
            requestArray = deniedRequests;
        } else {
            // Handle invalid category (optional)
            return null;
        }

        // Find the request with the given ID in the selected data array
        const foundRequest = requestArray.find((request) => request.Request_ID === requestId);

        return foundRequest || null;
    };


    // Neil Approves Request
    const handleNeilApproval = async (requestId) => {
        try {
            // Make a PUT request to /api/approve/Neil to approve the request and change the status
            const response = await Axios.put(`https://44.217.202.126/api/respond-to-request/${requestId}`, {
                Request_ID: requestId,
            });

            if (response.status === 200) {
                // Request approved successfully
                moveRequestToCompleted(requestId);
            } else {
                console.error('Failed to approve request:', response.data);
            }
        } catch (error) {
            console.error('Error approving request by Simon:', error);
        }
    };

    const moveRequestToCompleted = (requestId) => {
        const updatedRequests = pendingNeilApprovalRequests.filter(
            (request) => request.Request_ID !== requestId
        );

        // Add the request to the 'Completed' category
        setCompletedRequests((prevCompletedRequests) => [
            ...prevCompletedRequests,
            getRequestById(requestId),
        ]);

        setPendingNeilApprovalRequests(updatedRequests);
    };

    const handleDenyRequest = async (requestId) => {
        // You can display a modal or prompt for the denial reason here
        const reason = prompt('Enter Denial Reason:');
        if (reason !== null) {
            // User entered a reason
            try {
                // Make a PUT request to deny the request with the given reason
                const response = await Axios.put(`https://44.217.202.126/api/deny/${requestId}`, {
                    Request_ID: requestId,
                    Reason: reason,
                });

                if (response.status === 200) {
                    // Request denied successfully
                    moveRequestToDenied(requestId);
                } else {
                    console.error('Failed to deny request:', response.data);
                }
            } catch (error) {
                console.error('Error denying request:', error);
            }
        }
    };

    const moveRequestToDenied = (requestId) => {
        const updatedRequests = pendingNeilApprovalRequests.filter(
            (request) => request.Request_ID !== requestId
        );

        // Add the request to the 'Denied' category
        setDeniedRequests((prevDeniedRequests) => [
            ...prevDeniedRequests,
            getRequestById(requestId),
        ]);

        setPendingNeilApprovalRequests(updatedRequests);
    };

    return (
        <div>
            <Navbar email={email} />
            <h2>Requests Pending Neil Approval</h2>
            <ToggleButtonGroup
                className='toggle-button-group'
                value={currentCategory}
                exclusive
                onChange={(event, newCategory) => setCurrentCategory(newCategory)}
                aria-label="Category"
            >
                <ToggleButton className='toggle-button' value="pending">Pending</ToggleButton>
                <ToggleButton className='toggle-button' value="completed">Completed</ToggleButton>
                <ToggleButton className='toggle-button' value="denied">Denied</ToggleButton>
            </ToggleButtonGroup>

            <table>
                <thead>
                    <tr>
                        <th>Type of Request</th>
                        <th>Notes/Reason</th>
                        <th>Amount</th>
                        <th>Request Reason</th>
                        <th>Is it a Scope Change?</th>
                        <th>From Category/Project</th>
                        <th>To Category/Project</th>
                        <th>Requested By</th>
                        <th>Status</th>
                        <th>Denial Reason</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCategory === 'pending' &&
                        pendingNeilApprovalRequests.map((request) => (
                            (request.Status !== 'Request Denied' && request.Status !== 'Request Approve Completed' && request.Status !== 'Pending Simon Approval' && request.Status !== 'Pending Derek Approval') && (
                                <tr key={request.Request_ID}>
                                    <td>{request['Type of Request']}</td>
                                    <td>{request['Notes/Reason']}</td>
                                    <td>{request.Amount}</td>
                                    <td>{request['Request Reason']}</td>
                                    <td>{request['Scope Change']}</td>
                                    <td>{request['From Category/Project']}</td>
                                    <td>{request['To category/Project']}</td>
                                    <td>{request['Email']}</td>
                                    <td style={{ fontWeight: 'bold' }}>{request.Status}</td>
                                    <td>{request['Denial Reason']}</td>

                                    <td>
                                        <div className='request-button-container'>
                                            <button
                                                className='request-button'
                                                onClick={() => handleNeilApproval(request.Request_ID)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className='request-button'
                                                onClick={() => handleDenyRequest(request.Request_ID)}
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )
                        )}


                    {currentCategory === 'completed' &&
                        completedRequests.map((request) => (
                            (request.Status === 'Request Approve Completed') && (
                                <tr key={request.Request_ID}>
                                    <td>{request['Type of Request']}</td>
                                    <td>{request['Notes/Reason']}</td>
                                    <td>{request.Amount}</td>
                                    <td>{request['Request Reason']}</td>
                                    <td>{request['Scope Change']}</td>
                                    <td>{request['From Category/Project']}</td>
                                    <td>{request['To category/Project']}</td>
                                    <td>{request['Email']}</td>
                                    <td style={{ fontWeight: 'bold' }}>{request.Status}</td>
                                    <td>{request['Denial Reason']}</td>

                                    <td>
                                        <div className='request-button-container'>
                                            <button
                                                disabled
                                                className='request-button'
                                                onClick={() => handleNeilApproval(request.Request_ID)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                disabled
                                                className='request-button'
                                                onClick={() => handleDenyRequest(request.Request_ID)}
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        ))}

                    {currentCategory === 'denied' &&
                        deniedRequests.map((request) => (
                            (request.Status === 'Request Denied') && (
                                <tr key={request.Request_ID}>
                                    <td>{request['Type of Request']}</td>
                                    <td>{request['Notes/Reason']}</td>
                                    <td>{request.Amount}</td>
                                    <td>{request['Request Reason']}</td>
                                    <td>{request['Scope Change']}</td>
                                    <td>{request['From Category/Project']}</td>
                                    <td>{request['To category/Project']}</td>
                                    <td>{request['Email']}</td>
                                    <td style={{ fontWeight: 'bold' }}>{request.Status}</td>
                                    <td>{request['Denial Reason']}</td>
                                    <td>
                                        <div className='request-button-container'>
                                            <button
                                                className='request-button'
                                                disabled
                                                onClick={() => handleNeilApproval(request.Request_ID)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className='request-button'
                                                disabled
                                                onClick={() => handleDenyRequest(request.Request_ID)}
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        ))}

                </tbody>
            </table>
        </div>
    );
}

export default NeilApprovalsPage;
