import React, { useState, useEffect } from "react";
import axios from 'axios';
import Navbar from "../Navbar";
import { useNavigate } from 'react-router-dom';

export default function AddForm(props) {
  const {email} = props;
  const [_ /* eslint-disable-line no-unused-vars */, setData] = useState([]); // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [WBS, setWBS] = useState([]);
  const [programArea, setProgramArea] = useState([]);
  const [userInput, setUserInput] = useState({
    ProjectID: 'I20MD1',
    PurchaseFrom: '',
    Description: '',
    Notes: '',
    WBS: '',
    BuildingReference: '',
    ForecastType: '',
    ForecastAmount: '',
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

const buildingRef = userInput.BuildingReference;
const extractedBuildingRef = buildingRef.split(" - ")[0]; // Extract the part before " - "

const wbs = userInput.WBS;
const extractedWBS = wbs.split(" - ")[0]; // Extract the part before " - "

const result = { ...userInput, BuildingReference: extractedBuildingRef , WBS: extractedWBS};

  useEffect(() => {
    axios.get('https://44.217.202.126/api/data')
      .then((response) => {
        setData(response.data); // Process the received data
      })

      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    axios.get('https://44.217.202.126/api/data/WBS')
      .then((response) => {
        setWBS(response.data); // Process the received data
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
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInput({ ...userInput, [name]: value });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    axios.post('https://44.217.202.126/api/submit', result, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        alert("New Forecast added Successfully");
        setWBS('');
        setProgramArea('');
        setUserInput(prevState => {
          // Create a new object with the same keys but empty values
          const clearedUserInput = Object.fromEntries(
            Object.keys(prevState).map(key => [key, ''])
          );
          return clearedUserInput;
        });
        // Handle the response from the server if needed
        navigate('/FutureForecast')
      })
      .catch((error) => {
        console.error('Error sending object:', error);
      });
  }
  

  return (
      <div>
      <Navbar/>
      <div className="form-content-container">
      <div className="form-container">
      <form onSubmit={handleOnSubmit}>
        <h1 className="form-heading">Add Forecast</h1>

        <div className="dropdown">
        <select
          name="ProjectID"
          value={userInput.ProjectID}
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
            // required="required"
            id="input1"
            type="text"
            name="PurchaseFrom"
            value={userInput.PurchaseFrom}
            onChange={handleChange}
          />
          <span>Purchase From</span>
        </div>

        <div className="dropdown">
          <input
            // required="required"
            id="input1"
            type="text"
            name="Description"
            value={userInput.Description}
            onChange={handleChange}
          />
          <span>Description</span>
        </div>

        <div className="dropdown">
          <input
            // required="required"
            id="input1"
            type="text"
            name="Notes"
            value={userInput.Notes}
            onChange={handleChange}
          />
          <span>Notes</span>
        </div>

        <div className="dropdown">
          <select 
          // required="required"
            name="WBS"
            value={userInput.WBS['Product Code']}
            onChange={handleChange}>
            <option value=""></option>
            {WBS && WBS.length > 0 &&
              WBS.map(option => (
                <option key={option.id}>{`${option['Product Code']} - ${option['WBS Description']}`}</option>
              ))}
          </select>
          <span>WBS</span>
        </div>

        <div className="dropdown">
          <select 
          // required="required"
            name="BuildingReference"
            value={userInput['Program Area']}
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
          <select 
          // required="required"
            name="ForecastType"
            value={userInput.ForecastType}
            onChange={handleChange}>
            <option value=""></option>
            <option>Future Forecast</option>
            <option>Pending Change Order</option>
            <option>Pending Commitment</option>
          </select>
          <span>Forecast Type</span>
        </div>

        <div className="dropdown">
          <input
            // required="required"
            id="input1"
            type="text"
            name="ForecastAmount"
            value={userInput.ForecastAmount}
            onChange={handleChange}
          />
          <span>Forecast Amount</span>
        </div>

        <div className="dropdown">
          <input
            // required="required"
            id="input1"
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <span>Changed by</span>
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