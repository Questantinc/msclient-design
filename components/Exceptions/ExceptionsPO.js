import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { BiEditAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function ExceptionsPO() {
  const [DBdata, setDBData] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // Default to the first page
  const [vendorFilter, setVendorFilter] = useState("");
  const [vendorOptions, setVendorOptions] = useState([]);
  const [wbsFilter, setWbsFilter] = useState("");
  const [wbsOptions, setWbsOptions] = useState([]);
  const [buildingRefFilter, setBuildingRefFilter] = useState("");
  const [buildingRefOptions, setBuildingRefOptions] = useState([]);

  useEffect(() => {
    axios
      .get("https://44.217.202.126/api/ExceptionsPurchaseTable/data")
      .then((response) => {
        setDBData(response.data);
        setVendorOptions([...new Set(response.data.map((item) => item.Vendor))]);
        setWbsOptions([...new Set(response.data.map((item) => item.WBS))]);
        setBuildingRefOptions([
          ...new Set(response.data.map((item) => item["Building Reference"]))
        ]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleVendorFilterChange = (event) => {
    setVendorFilter(event.target.value);
  };

  const handleWbsFilterChange = (event) => {
    setWbsFilter(event.target.value);
  };

  const handleBuildingRefFilterChange = (event) => {
    setBuildingRefFilter(event.target.value);
  };

  const handleEdit = (rowData) => {
    navigate("/POTable/Edit", { state: { rowData } });
  };

  const wbsDescriptions = {
    "2111918": "Building",
    "2111919": "Electrical",
    "2111920": "Engineering",
    "2111921": "Equipment",
    "2111922": "Installation",
    "2111923": "Instrumentation",
    "2111924": "Insulation",
    "2111925": "Painting",
    "2111926": "Piping",
    "9999999": "Contingency",
    "0000000": "Unallocated"
  };

  const filteredData = DBdata.filter(
    (item) =>
      (vendorFilter === "" || item.Vendor === vendorFilter) &&
      (wbsFilter === "" || item.WBS === wbsFilter) &&
      (buildingRefFilter === "" || item["Building Reference"] === buildingRefFilter)
  );

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  
  const calculateTotal = () => {
    const total = filteredData.reduce(
      (sum, item) => sum + (item["Line Amount"] || 0),
      0
    );
    return total.toLocaleString();
  };

  return (
    <div>
      <Navbar />
      <h1 className="table-header">Exceptions Purchase Order Table</h1>
      <div className="filter-container">
        <span>Vendor:</span>
        <select value={vendorFilter} onChange={handleVendorFilterChange}>
          <option value="">All Vendors</option>
          {vendorOptions.map((vendor) => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>
        <span>WBS:</span>
        <select value={wbsFilter} onChange={handleWbsFilterChange}>
          <option value="">All WBS</option>
          {wbsOptions.map((wbs) => (
            <option key={wbs} value={wbs}>
              {wbs}
            </option>
          ))}
        </select>
        <span>Building Reference:</span>
        <select
          value={buildingRefFilter}
          onChange={handleBuildingRefFilterChange}
        >
          <option value="">All Building References</option>
          {buildingRefOptions.map((buildingRef) => (
            <option key={buildingRef} value={buildingRef}>
              {buildingRef}
            </option>
          ))}
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>PO ID</th>
              <th>Line Number</th>
              <th>Vendor</th>
              <th>Description</th>
              <th>WBS</th>
              <th>Building Reference</th>
              <th>Line Amount</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData
                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                .map((item) => (
                <tr key={item["Project ID"]}>
                  <td>{item["Project ID"]}</td>
                  <td>{item["PO ID"]}</td>
                  <td>{item["Line No"]}</td>
                  <td>{item.Vendor}</td>
                  <td>{item.Description}</td>
                  <td>{wbsDescriptions[item.WBS]} ({item.WBS})</td>      
                  <td>{item["Building Reference"]}</td>
                  <td>
                    {item["Line Amount"] !== null
                      ? item["Line Amount"].toLocaleString()
                      : null}
                  </td>
                  <td>
                  <button
                    onClick={() => handleEdit(item)}
                    className="edit-btn form-btn"
                  >
                    <BiEditAlt size={24} />
                  </button>
                </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data-row">
                  No data available.
                </td>
              </tr>
            )}
            <tr className="table-total">
              <td colSpan="7" style={{ fontWeight: "bold" }}>
                Total:
              </td>
              <td style={{ fontWeight: "bold" }}>${calculateTotal()}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
    </div>
  );
}

export default ExceptionsPO;
