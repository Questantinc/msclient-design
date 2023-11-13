import React, { useState, useEffect } from 'react';
import './request.css';
import Axios from 'axios';
import Navbar from '../Navbar';

function RequestForm({ email }) {
  const [requestText, setRequestText] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedScopeChange, setSelectedScopeChange] = useState('');
  const [selectedFromProject, setSelectedFromProject] = useState('');
  const [selectedToProject, setSelectedToProject] = useState('');
  const [amount, setAmount] = useState('');
  // const [requestID, setRequestID] = useState('');
  const [projects, setProjects] = useState([]); // State for project data
  const [emailValue, setEmailValue] = useState(email); // Rename 'email' state variable
  const [selectedFromProjectWBS, setSelectedFromProjectWBS] = useState(''); // Added missing state
  const [selectedToProjectWBS, setSelectedToProjectWBS] = useState(''); // Added missing state
  const defaultWBSProjects = ["Design Change Orders", "Project Risk and Scope Contingency", "CEO Contingency", "Juice Softening Caro", "Juice Softening Sebewaing"];

  useEffect(() => {
    // Fetch the project data from your API
    Axios.get('https://44.217.202.126/api/RequestWorkflow/ProjectName')
      .then((response) => {
        // Assuming the response data is an array of projects with properties "ProjectName" and "WBSDescription"
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching project data:', error);
      });
  }, []);

  console.log('selectedFromProject before submit:', selectedFromProject);


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the data to send to the server with the default status "Pending"
    const requestData = {
      "Type of Request": selectedTopic,
      "Notes/Reason": requestText,
      "Request Reason": requestReason,
      "Scope Change": selectedScopeChange,
      "From Category/Project": `${selectedFromProject}-${selectedFromProjectWBS}`, // Combine both selected values
      "To category/Project": `${selectedToProject}-${selectedToProjectWBS}`, // Combine both selected values
      "Amount": amount,
      // "RequestID": requestID,
      "Email": emailValue,
      "Status": "Pending", // Set the default status here
    };

    try {
      // Send a POST request to your server to insert the data
      const response = await Axios.post('https://44.217.202.126/api/RequestWorkflow/RequestForm', requestData);
      console.log(response);

      // Check the response and handle success or error as needed
      if (response.status === 200) {
        // Data inserted successfully

        // console.log('Form submitted successfully:', requestText, selectedTopic, requestID);

        setRequestText('');
        setRequestReason('');
        setSelectedScopeChange('');
        setSelectedTopic('');
        setSelectedFromProject('');
        setSelectedToProject('');
        setAmount('');
        // setRequestID('');
      } else {
        // Handle error
        console.error('Failed to insert data:', response.data);
      }
    } catch (error) {
      // Handle network error or other issues
      console.error('Error inserting data:', error);
    }
  };

  const allowedWBSDescriptions = [
    "Equipment",
    "Electrical",
    "Engineering",
    "Insulation",
    "Piping",
    "Instrumentation",
    "Building",
    "Unallocated",
    "Installation",
  ];

  // Filter distinct Project Names
  const distinctProjectNames = [...new Set(projects.map((project) => project['Project Name']))];
  // Filter distinct WBS Descriptions
  // const distinctWBSDescriptions = [...new Set(projects.map((project) => project['WBS Description']))];


  return (
    <div>
      <Navbar />

      <div className="form-content-container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h2 className="form-heading">Request Form</h2>

            {/* <input
              className="request-textarea"
              placeholder="Request ID"
              value={requestID}
              onChange={(e) => setRequestID(e.target.value)}
            /> */}

            <textarea
              className="request-textarea"
              rows="3"
              cols="40"
              placeholder="Description"
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
            />

            <textarea
              className="request-textarea"
              rows="3"
              cols="40"
              placeholder="Reason for Request"
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
            />

            <select
              className="request-dropdown"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <option value="">Reason Code</option>
              <option value="Project Scope Change">Project Scope Change</option>
              <option value="Operational Need">Operational Need</option>
              <option value="Design Change">Design Change</option>
              <option value="Health and Safety">Health and Safety</option>
              <option value="Acceleration">Acceleration</option>
            </select>

            <select
              className="request-dropdown"
              value={selectedScopeChange}
              onChange={(e) => setSelectedScopeChange(e.target.value)}
            >
              <option value="">Scope Change</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <input
              className="request-textarea"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

<div className="dropdown-container">
            <select
              className="request-dropdown"
              value={selectedFromProject}
              onChange={(e) => setSelectedFromProject(e.target.value)}
            >
              <option value="">From Category/Project</option>
              {distinctProjectNames.map((projectName) => (
                <option key={projectName} value={projectName}>
                  {projectName}
                </option>
              ))}
            </select>

            {/* WBS Description dropdown for "To Category/Project" */}
            <select
              className="request-dropdown"
              value={selectedFromProjectWBS}
              onChange={(e) => setSelectedFromProjectWBS(e.target.value)}
            >
              <option value="">WBS Description</option>
              {selectedFromProject && defaultWBSProjects.includes(selectedFromProject) ? (
                <option value="Unallocated">Unallocated</option>
              ) : (
                allowedWBSDescriptions.map((wbsDescription) => (
                  <option key={wbsDescription} value={wbsDescription}>
                    {wbsDescription}
                  </option>
                ))
              )}
            </select>
            </div>
            {/* ProjectName dropdown for "To Category/Project" */}
            <div className="dropdown-container">
            <select
              className="request-dropdown"
              value={selectedToProject}
              onChange={(e) => setSelectedToProject(e.target.value)}
            >
              <option value="">To Category/Project</option>
              {distinctProjectNames.map((projectName) => (
                <option key={projectName} value={projectName}>
                  {projectName}
                </option>
              ))}
            </select>

            {/* WBS Description dropdown for "To Category/Project" */}
            <select
              className="request-dropdown"
              value={selectedToProjectWBS}
              onChange={(e) => setSelectedToProjectWBS(e.target.value)}
            >
              <option value="">WBS Description</option>
              {selectedToProject && defaultWBSProjects.includes(selectedToProject) ? (
                <option value="Unallocated">Unallocated</option>
              ) : (
                allowedWBSDescriptions.map((wbsDescription) => (
                  <option key={wbsDescription} value={wbsDescription}>
                    {wbsDescription}
                  </option>
                ))
              )}
            </select>
            </div>

            <input
              className="request-textarea"
              placeholder="Request By"
              value={emailValue} // Use 'emailValue' instead of 'email'
              onChange={(e) => setEmailValue(e.target.value)} // Update 'emailValue'
            />

            <button className="submit-button" type="submit">Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RequestForm;
