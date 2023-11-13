import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

export default function EditPurchase(props) {
  const {email, userRole } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [_ /* eslint-disable-line no-unused-vars */, setWBS] = useState([]);
  const [WBSOptions, setWBSOptions] = useState([]);
  const [programArea, setProgramArea] = useState([]);
  const [editedInput, setEditedInput] = useState({
    PID: '',
    ProjectID: '',
    POID: '',
    LineNo: '',
    Vendor: '',
    Description: '',
    WBS: '',
    LineAmount: '',
    BuildingReference: '',
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
    axios.get('https://44.217.202.126/api/purchaseTable/data')
      .then((response) => {
        setData(response.data); // Process the received data
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    axios.get('https://44.217.202.126/api/data/WBS')
      .then((response) => {
        setWBSOptions(response.data); // Process the received data
      })
      .catch((error) => {
        console.error('Error fetching WBS:', error);
      });

    axios.get('https://44.217.202.126/api/data/programArea')
      .then((response) => {
        setProgramArea(response.data); // Process the received data
      })
      .catch((error) => {
        console.error('Error fetching Program Area:', error);
      });

    // Populate the form fields with the data from the selected row
    const rowData = location.state?.rowData;
    console.log(rowData)
    if (rowData) {
      setEditedInput({
        PID: rowData.PID,
        ProjectID: rowData["Project ID Renamed"],
        POID: rowData['PO ID'],
        LineNo: rowData['Line No'],
        Vendor: rowData.Vendor,
        Description: rowData.Description,
        WBS: rowData.WBS,
        LineAmount: rowData['Line Amount'],
        BuildingReference: rowData['Building Reference'],
      });
    }
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedInput({ ...editedInput, [name]: value });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const result = window.confirm("Are you sure you want to edit Purchase Order with PID: " + editedInput.PID);

    // Extract the part before " - " from BuildingReference
    const buildingRef = editedInput.BuildingReference;
    const extractedBuildingRef = buildingRef ? buildingRef.split(" - ")[0] : null; // Check for null before using split

    const wbs = editedInput.WBS;
    const extractedWBS = wbs ? wbs.split(" - ")[0] : null; // Check for null before using split

    const resultData = {
      ...editedInput,
      BuildingReference: extractedBuildingRef,
      WBS: extractedWBS,
      Email: email
    };

    if (result) {
      axios
        .put('https://44.217.202.126/api/submit/purchaseForm/edit', resultData)
        .then((response) => {
          alert("Purchase Order edited successfully");
          setEditedInput({
            PID: '',
            ProjectID: '',
            POID: '',
            LineNo: '',
            Vendor: '',
            Description: '',
            WBS: '',
            LineAmount: '',
            BuildingReference: '',
            Email: email
          });
          console.log(response.data); // Process the response as needed
          navigate('/POTable')
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
            <h1 className="form-heading">Edit Purchase Form</h1>

            <div className="dropdown">
              <select
                disabled={userRole.trim() === "editor"}
                name="ProjectID"
                value={editedInput.ProjectID}
                onChange={handleChange}
              >
                {Object.keys(projectIdDescriptions)
                .map((projectId) => (
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
                  [...new Set(data.map(option => option['PO ID']))]
                  .sort()
                  .map(uniquePOID => (
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
                  [...new Set(data
                    .sort()
                    .map(option => option['Line No']))]
                  .map(uniqueLineNo => (
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
                // required="required"
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
                {WBSOptions
                .sort()
                .map((option) => (
                  <option key={option.id} value={option["Product Code"]}>
                    {`${option['Product Code']} - ${option['WBS Description']}`}
                  </option>
                ))}
              </select>
              <span>WBS</span>
            </div>

            <div className="dropdown">
              <select
                //  required="required"
                name="BuildingReference"

                value={editedInput.BuildingReference}
                onChange={handleChange}>
                <option value=""></option>
                {programArea && programArea.length > 0 &&
                  programArea.slice(0, programArea.length - 4).map(option => (
                    <option key={option.id}>{`${option['Program Area']} - ${option['Description']}`}</option>
                  ))}
              </select>
              <span>Building Reference</span>
            </div>

            <div className="dropdown">
              <input
              disabled={userRole.trim() === 'editor'}
                // required="required"
                id="input1"
                type="text"
                name="LineAmount"
                value={editedInput.LineAmount}
                onChange={handleChange}
              />
              <span>Line Amount</span>
            </div>

            <div className="dropdown">
              <input
                required="required"
                id="input1"
                type="text"
                name="email"
                value={email}
                onChange={handleChange}
              />
              <span>Changed By</span>
            </div>

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
