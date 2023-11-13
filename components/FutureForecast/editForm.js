import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useLocation, useNavigate } from "react-router-dom";

function EditForm(props) {
  const {email, userRole} = props;
  const location = useLocation();
  const page = new URLSearchParams(location.search).get('page');
  const navigate = useNavigate();
  const [WBSOptions, setWBSOptions] = useState([]);
  const [programAreaOptions, setProgramAreaOptions] = useState([]);
  const [editedInput, setEditedInput] = useState({
    FID: "",
    ProjectID: "I20MD1",
    PurchaseFrom: "",
    Description: "",
    Notes: "",
    WBS: "",
    BuildingReference: "",
    ForecastType: "",
    ForecastAmount: "",
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
    axios
      .get("https://44.217.202.126/api/data/WBS")
      .then((response) => {
        setWBSOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching WBS:", error);
      });

    axios
      .get("https://44.217.202.126/api/data/programArea")
      .then((response) => {
        setProgramAreaOptions(response.data.slice(0, response.data.length - 4));
      })
      .catch((error) => {
        console.error("Error fetching Program Area:", error);
      });

    // Populate the form fields with the data from the selected row
    const rowData = location.state?.rowData;
    console.log(rowData)
    if (rowData) {
      setEditedInput({
        FID: rowData.FID,
        ProjectID: rowData["Project ID"],
        PurchaseFrom: rowData["Purchase From"],
        Description: rowData.Description,
        Notes: rowData.Notes,
        WBS: rowData.WBS,
        BuildingReference: rowData["Building Reference"],
        ForecastType: rowData["Forecast Type"],
        ForecastAmount: rowData["Forecast Amount"]
      });
    }
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedInput({ ...editedInput, [name]: value });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const result = window.confirm(
      "Are you sure you want to edit forecast with FID: " + editedInput.FID
    );

    // Extract the part before " - "
    const buildingRef = editedInput.BuildingReference;
    const extractedBuildingRef = buildingRef ? buildingRef.split(" - ")[0] : "";
  
    const wbs = editedInput.WBS;
    const extractedWBS = wbs ? wbs.split(" - ")[0] : "";
  
    const resultData = {
      ...editedInput,
      BuildingReference: extractedBuildingRef,
      WBS: extractedWBS,
      Email: email
    };
  
    console.log(resultData);

    if (result) {
      axios
        .put("https://44.217.202.126/api/submit/edit", resultData)
        .then((response) => {
          alert("Forecast edited successfully");
          setEditedInput({
            FID: "",
            ProjectID: "I20MD1",
            PurchaseFrom: "",
            Description: "",
            Notes: "",
            WBS: "",
            BuildingReference: "",
            ForecastType: "",
            ForecastAmount: "",
            Email: email
          });
          console.log(response.data); // Process the response as needed
          if (page) {
            navigate(`/FutureForecast?page=${page}`);
          } else {
            navigate('/FutureForecast');
          }
        })
        .catch((error) => {
          console.error("Error updating data:", error);
          // Display an error message or update the UI accordingly
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
            <h1 className="form-heading">Edit Forecast</h1>

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
              <input
               disabled={userRole.trim() === 'editor'}
                type="text"
                name="PurchaseFrom"
                value={editedInput.PurchaseFrom}
                onChange={handleChange}
              />
              <span>Purchased From</span>
            </div>

            <div className="dropdown">
              <input
               disabled={userRole.trim() === 'editor'}
                type="text"
                name="Description"
                value={editedInput.Description}
                onChange={handleChange}
              />
              <span>Description</span>
            </div>

            <div className="dropdown">
              <input
               disabled={userRole.trim() === 'editor'}
                type="text"
                name="Notes"
                value={editedInput.Notes}
                onChange={handleChange}
              />
              <span>Notes</span>
            </div>

            <div className="dropdown">
              <select
                name="WBS"
                value={editedInput.WBS}
                onChange={handleChange}
              >
                <option value=""></option>
                {WBSOptions.map((option) => (
                  <option key={option.id} value={option["Product Code"]}>
                    {`${option["Product Code"]} - ${option["WBS Description"]}`}
                  </option>
                ))}
              </select>
              <span>WBS</span>
            </div>

            <div className="dropdown">
              <select
                name="BuildingReference"
                value={editedInput.BuildingReference}
                onChange={handleChange}
              >
                <option value=""></option>
                {programAreaOptions.map((option) => (
                  <option key={option.id} value={option["Program Area"]}>
                    {`${option["Program Area"]} - ${option["Description"]}`}
                  </option>
                ))}
              </select>
              <span>Building Reference</span>
            </div>

            <div className="dropdown">
              <select
               disabled={userRole.trim() === 'editor'}
                name="ForecastType"
                value={editedInput.ForecastType}
                onChange={handleChange}
              >
                <option value=""></option>
                <option>Future Forecast</option>
                <option>Pending Change Order</option>
                <option>Pending Commitment</option>
              </select>
              <span>Forecast Type</span>
            </div>

            <div className="dropdown">
              <input
                // required
               disabled={userRole.trim() === 'editor'}
                type="text"
                name="ForecastAmount"
                value={editedInput.ForecastAmount}
                onChange={handleChange}
              />
              <span>Forecast Amount</span>
            </div>

            <div className="dropdown">
              <input
                // required
                type="text"
                name="email"
                value={email}
                onChange={handleChange}
              />
              <span>Changed by</span>
            </div>

            <div className="btn-container">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditForm;

