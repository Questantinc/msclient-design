import React, { useState, useEffect } from "react";
import axios from 'axios';
import Navbar from "../Navbar";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditForm(props) {
  const {email, userRole } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [WBSOptions, setWBSOptions] = useState([]);
  const [_ /* eslint-disable-line no-unused-vars */, setProgramArea] = useState([]);
  const [editedInput, setEditedInput] = useState({
    InvID: '',
    InvoiceID: '',
    ProjectID: '',
    POID: '',
    LineNo: '',
    Vendor: '',
    Description: '',
    WBS: '',
    InvoiceAmount: '',
    BuildingReference: '',
    ReceiverLineNo: '',
    Email: email
  });

  const projectIdDescriptions = {
    "I20MD1": "Molasses DeSugarization",
    "I20MD1.1": "Molasses Unloading",
    "I30MD2": "Juice Softening - Caro",
    "I60MD3": "Juice Softening - Sebewaing",
    "99PM1.1": "Project Management and Cost Control",
    "99PM1.2": "Design Change Orders",
    "99PM2.1": "Project Risk Contingency",
    "99PM2.2": "CEO Contingency"
  };

  useEffect(() => {
    axios.get('https://44.217.202.126/api/invoicesTable/data')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    axios.get('https://44.217.202.126/api/data/WBS')
      .then((response) => {
        setWBSOptions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching WBS:', error);
      });

    axios.get('https://44.217.202.126/api/data/programArea')
      .then((response) => {
        setProgramArea(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Program Area:', error);
      });

    const rowData = location.state?.rowData;
    if (rowData) {
      setEditedInput({
        InvID: rowData.InvID,
        ProjectID: rowData["Project ID Renamed"],
        InvoiceID: rowData['Invoice ID'],
        POID: rowData['PO ID'],
        LineNo: rowData['Line No'],
        Vendor: rowData.Vendor,
        Description: rowData.Description,
        WBS: rowData.WBS,
        InvoiceAmount: rowData['Invoice Amount'],
        BuildingReference: rowData['Building Reference'],
        ReceiverLineNo: rowData['Receiver Line No'],
      });
    }
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedInput({ ...editedInput, [name]: value });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const result = window.confirm("Are you sure you want to edit forecast: " + editedInput.InvID);

    // Extract the part before " - " from BuildingReference
    const buildingRef = editedInput.BuildingReference || '';
    const extractedBuildingRef = buildingRef.split(" - ")[0];

    // Extract the part before " - " from WBS
    const wbs = editedInput.WBS || '';
    const extractedWBS = wbs.split(" - ")[0];

    const resultData = {
      ...editedInput,
      BuildingReference: extractedBuildingRef,
      WBS: extractedWBS,
      Email: email
    };

    if (result) {
      axios
        .put('https://44.217.202.126/api/submit/InvoiceForm/edit', resultData)
        .then((response) => {
          alert("Invoices edited successfully");
          setEditedInput({
            InvID: '',
            InvoiceID: '',
            ProjectID: '',
            POID: '',
            LineNo: '',
            Vendor: '',
            Description: '',
            WBS: '',
            InvoiceAmount: '',
            BuildingReference: '',
            ReceiverLineNo: '',
            Email: email
          });
          console.log(response.data); // Process the response as needed
          navigate('/Invoices')
        })
        .catch((error) => {
          console.error('Error updating data:', error);
        });
    } else {
      alert("Form not submitted");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-content-container">
        <div className="form-container">
          <form onSubmit={handleOnSubmit}>
            <h1 className="form-heading">Edit Invoice Form</h1>

            <div className="dropdown">
              <select
              disabled={userRole.trim() === 'editor'}
                name="InvoiceID"
                value={editedInput.InvoiceID}
                onChange={handleChange}
              >
                <option value=""></option>
                {data &&
                  data.length > 0 &&
                  [...new Set(data
                    .sort()
                    .map(option => option['Invoice ID']))].map(uniqueInvoiceID => (
                    <option key={uniqueInvoiceID} value={uniqueInvoiceID}>
                      {uniqueInvoiceID}
                    </option>
                  ))}
              </select>
              <span>Invoice ID</span>
            </div>

            <div className="dropdown">
              <select
                disabled={userRole.trim() === "editor"}
                name="ProjectID"
                value={editedInput.ProjectID}
                onChange={handleChange}
              >
                {Object.keys(projectIdDescriptions).map((projectId) => (
                  <option key={projectId} value={projectId}>
                    {projectId} - {projectIdDescriptions[projectId]}
                  </option>
                ))}
              </select>
              <span>Project ID</span>
            </div>

            <div className="dropdown">
              <select
              disabled={userRole.trim() === 'editor'}
                name="POID"
                value={editedInput.POID}
                onChange={handleChange}
              >
                <option value=""></option>
                {data &&
                  data.length > 0 &&
                  [...new Set(data.sort().map(option => option['PO ID']))].map(uniquePOID => (
                    <option key={uniquePOID} value={uniquePOID}>
                      {uniquePOID}
                    </option>
                  ))}
              </select>
              <span>PO ID</span>
            </div>

            <div className="dropdown">
              <select
              disabled={userRole.trim() === 'editor'}
                name="LineNo"
                value={editedInput.LineNo}
                onChange={handleChange}
              >
                <option value=""></option>
                {data &&
                  data.length > 0 &&
                  [...new Set(data.map(option => option['Line No']))].map(uniqueLineNo => (
                    <option key={uniqueLineNo} value={uniqueLineNo}>
                      {uniqueLineNo}
                    </option>
                  ))}
              </select>
              <span>Line Number</span>
            </div>

            <div className="dropdown">
              <select
              disabled={userRole.trim() === 'editor'}
                name="Vendor"
                value={editedInput.Vendor}
                onChange={handleChange}
              >
                <option value=""></option>
                {data &&
                  data.length > 0 &&
                  [...new Set(data.map(option => option.Vendor))]
                  .sort()
                  .map(uniqueVendor => (
                    <option key={uniqueVendor} value={uniqueVendor}>
                      {uniqueVendor}
                    </option>
                  ))}
              </select>
              <span>Vendor</span>
            </div>

            <div className="dropdown">
              <input
              disabled={userRole.trim() === 'editor'}
                id="input1"
                type="text"
                name="Description"
                value={editedInput.Description}
                onChange={handleChange}
              />
              <span>Description</span>
            </div>

            <div className="dropdown">
              <select
                name="WBS"
                value={editedInput.WBS}
                onChange={handleChange}>
                <option value=""></option>
                {WBSOptions.map((option) => (
                  <option key={option.id} value={option["Product Code"]}>
                    {`${option['Product Code']} - ${option['WBS Description']}`}
                  </option>
                ))}
              </select>
              <span>WBS</span>
            </div>

            <div className="dropdown">
              <input
              disabled={userRole.trim() === 'editor'}
                id="input1"
                type="text"
                name="InvoiceAmount"
                value={editedInput.InvoiceAmount}
                onChange={handleChange}
              />
              <span>Invoice Amount</span>
            </div>

            <div className="dropdown">
              <input
                required="required"
                id="input1"
                type="text"
                name="Email"
                value={email}
                onChange={handleChange}
              />
              <span>Changed By</span>
            </div>

            {/* Add other fields here... */}

            <div className="btn-container">
              <button type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
