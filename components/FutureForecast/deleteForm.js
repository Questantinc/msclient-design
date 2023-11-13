import React, { useState, useEffect } from "react";
import axios from 'axios';
import Navbar from "../Navbar";
import { useLocation, useNavigate } from "react-router-dom";

export default function DeleteForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedFID, setSelectedFID] = useState({
    FID: "",
    Description: "",
    ForecastAmount: ""
  });
  const [_ /* eslint-disable-line no-unused-vars */, setData] = useState([]);
  
  useEffect(() => {
    axios.get('https://44.217.202.126/api/data')
      .then((response) => {
        setData(response.data); // Save the data in state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    // Populate the form fields with the data from the selected row
    const rowData = location.state?.rowData;
    if (rowData) {
      setSelectedFID({
        FID: rowData.FID,
        Description: rowData.Description,
        ForecastAmount: rowData["Forecast Amount"]
      });
    }
  }, [location.state]);

  const handleChange = (event) => {
    // const { value } = event.target;
    // setSelectedFID(value);
    const { name, value } = event.target;
    setSelectedFID({ ...selectedFID, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(selectedFID);

    if (selectedFID) {
      const result = window.confirm("Are you sure you want to delete from Forecast: ");

      if (result) {
        try {
          await axios.delete(`https://44.217.202.126/api/submit/${selectedFID.FID}`);
          console.log("Delete successful");
          // Display a success message or update the UI accordingly
          alert("Deleted Successfully");
          setSelectedFID(""); // Reset the FID field after successful deletion
          navigate('/FutureForecast')
        } catch (error) {
          console.error('Error deleting data:', error);
          // Display an error message or update the UI accordingly
        }
      }
    } else {
      alert("Deletion cancelled");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-content-container">
        <div className="form-container">
          <form onSubmit={handleFormSubmit}>
            <h1 className="form-heading">Delete Forecast</h1>
            <div className="dropdown">
              <input
                required
                type="text"
                name="FID"
                value={selectedFID.FID}
                onChange={handleChange}
              />
              <span>FID</span>
            </div>

            <div className="dropdown">
              <input
                required
                type="text"
                name="Description"
                value={selectedFID.Description}
                onChange={handleChange}
              />
              <span>Description</span>
            </div>

            <div className="dropdown">
              <input
                required
                type="text"
                name="ForecastAmount"
                value={selectedFID.ForecastAmount}
                onChange={handleChange}
              />
              <span>Forecast Amount</span>
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
