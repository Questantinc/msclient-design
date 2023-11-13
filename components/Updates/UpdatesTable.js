import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";

function UpdatesTable() {
const [DBdata, setDBData] = useState([]);
  const [wbsFilter, setWbsFilter] = useState("");
  const [wbsOptions, setWbsOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Default to the first page

  useEffect(() => {
    axios
      .get("https://44.217.202.126/api/updatestable/data")
      .then((response) => {
        setDBData(response.data);
        setWbsOptions([...new Set(response.data.map((item) => item.WBS))]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleWbsFilterChange = (event) => {
    setWbsFilter(event.target.value);
  };

  const filteredData = DBdata.filter(
    (item) =>
      (wbsFilter === "" || item.WBS === wbsFilter)
  );

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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
      <h1 className="table-header">Updates Table</h1>
      <div className="filter-container">
        <span>WBS:</span>
        <select value={wbsFilter} onChange={handleWbsFilterChange}>
          <option value="">All WBS</option>
          {wbsOptions.map((wbs) => (
            <option key={wbs} value={wbs}>
              {wbsDescriptions[wbs]} ({wbs})
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
              <th>Line No</th>
              <th>Vendor</th>
              <th>Description</th>
              <th>WBS</th>
              <th>Freight</th>
              <th>Miscellaneous</th>
              <th>Line Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
            .map((item) => (
                <tr key={item.FID}>
                  <td>{item["Project ID Renamed"]}</td>
                  <td>{item["PO ID"]}</td>
                  <td>{item["Line No"]}</td>
                  <td>{item.Vendor}</td>
                  <td>{item.Description}</td>
                  <td>{wbsDescriptions[item.WBS]} ({item.WBS})</td>      
                  <td>{item.Freight}</td>
                  <td>{item.Miscellaneous}</td>
                  <td>
                    {item["Line Amount"] !== null
                      ? item["Line Amount"].toLocaleString()
                      : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-data-row">
                  No data available.
                </td>
              </tr>
            )}
             <tr className="table-total">
              <td colSpan="8" style={{ fontWeight: "bold" }}>
                Total:
              </td>
              <td style={{ fontWeight: "bold" }}>${calculateTotal()}</td>
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

export default UpdatesTable