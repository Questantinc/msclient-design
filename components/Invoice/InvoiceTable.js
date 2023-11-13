import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { BiEditAlt, BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function InvoiceTable() {
  const [DBdata, setDBData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [vendorFilter, setVendorFilter] = useState("");
  const [vendorOptions, setVendorOptions] = useState([]);
  const [projectIdOptions, setProjectIdOptions] = useState([]);
  const [projectIdFilter, setProjectIdFilter] = useState("");
  // eslint-disable-next-line
  const [filteredProjectIdData, setFilteredProjectIdData] = useState([]);
  // eslint-disable-next-line
  const [filteredVendorData, setFilteredVendorData] = useState([]);


  useEffect(() => {
    axios
      .get("https://44.217.202.126/api/invoicesTable/data")
      .then((response) => {
        setDBData(response.data);
        const vendors = [...new Set(response.data.map((item) => item.Vendor))];
        const sortedVendors = vendors.sort((a, b) => a.localeCompare(b));
        setVendorOptions(sortedVendors);
        setProjectIdOptions([...new Set(response.data.map((item) => item["Project ID Renamed"]))]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const filteredByProjectId = DBdata.filter(
      (item) =>
        projectIdFilter === "" || item["Project ID Renamed"] === projectIdFilter
    );
    setFilteredProjectIdData(filteredByProjectId);

    const filteredByVendor = DBdata.filter(
      (item) => vendorFilter === "" || item.Vendor === vendorFilter
    );
    setFilteredVendorData(filteredByVendor);
  }, [DBdata, projectIdFilter, vendorFilter]);

  const handleProjectIdFilterChange = (event) => {
    const selectedProjectId = event.target.value;
    setProjectIdFilter(selectedProjectId);
    // Don't reset vendor filter when selecting project ID
  };

  const handleVendorFilterChange = (event) => {
    const selectedVendor = event.target.value;
    setVendorFilter(selectedVendor);
    // Don't reset project ID filter when selecting vendor
  };

  const handleEdit = (rowData) => {
    navigate("/Invoices/Edit", { state: { rowData } });
  };

  // Use the selected filter value to conditionally filter the data
  const filteredData = DBdata.filter((item) => {
    const projectIdMatch = projectIdFilter === "" || item["Project ID Renamed"] === projectIdFilter;
    const vendorMatch = vendorFilter === "" || item.Vendor === vendorFilter;

    return projectIdMatch && vendorMatch;
  });

  const calculateFreightTotal = () => {
    const totalFreight = filteredData.reduce(
      (sum, item) => sum + (item.Freight || 0),
      0
    );
    return totalFreight.toLocaleString();
  };

  const calculateMiscellaneousTotal = () => {
    const totalMiscellaneous = filteredData.reduce(
      (sum, item) => sum + (item.Miscellaneous || 0),
      0
    );
    return totalMiscellaneous.toLocaleString();
  };

  const calculateInvoiceAmountTotal = () => {
    const totalInvoiceAmount = filteredData.reduce(
      (sum, item) => sum + (item["Invoice Amount"] || 0),
      0
    );
    return totalInvoiceAmount.toLocaleString();
  };


  const [sortConfig, setSortConfig] = useState({
    key: "PO ID",
    direction: "asc"
  });

  const handleSort = () => {
    const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: "PO ID", direction: newDirection });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (a["PO ID"] < b["PO ID"]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a["PO ID"] > b["PO ID"]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const rowsPerPage = 10;
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const projectIdDescriptions = {
    "I20MD1": "Molasses DeSugarization",
    "I20MD1.1": "Molasses Unloading",
    "I30MD2": "Juice Softening - Caro",
    "I60MD3": "Juice Softening - Sebewaing",
    "99PM1.1": "Project Management and Cost Control",
    "99PM1.2": "Design Change Orders",
    "99PM2.1": "Project Risk Contingency",
    "99PM2.2": "CEO Contingency"
  }

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

  return (
    <div>
      <Navbar />
      <h1 className="table-header">Invoices Table</h1>
      <div className="filter-container">
        <span>Project ID:</span>
        <select value={projectIdFilter} onChange={handleProjectIdFilterChange}>
          <option value="">All Project IDs</option>
          {projectIdOptions.map((projectId) => (
            <option key={projectId} value={projectId}>
              {projectIdDescriptions[projectId]} ({projectId})
            </option>
          ))}
        </select>
        <span>Vendor:</span>
        <select value={vendorFilter} onChange={handleVendorFilterChange}>
          <option value="">All Vendors</option>
          {vendorOptions.map((vendor) => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Project ID</th>
              <th onClick={handleSort}>
                PO ID{" "}
                {sortConfig.key === "PO ID" && (
                  sortConfig.direction === "asc" ? <BiSolidUpArrow /> : <BiSolidDownArrow />
                )}
              </th>
              <th>Line Number</th>
              <th>Vendor</th>
              <th>Description</th>
              <th>WBS</th>
              <th>Invoice ID</th>
              <th>Invoice Date</th>
              <th>Payment Date</th>
              <th>Freight</th>
              <th>Miscellaneous</th>
              <th>Invoice Amount</th>
              {/* <th>Building Reference</th>
              <th>Receiver Line No.</th> */}
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {sortedData
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
              .map((item) => (
                <tr key={item.InvID}>
                  <td>{item["Project ID Renamed"]}</td>
                  <td>{item["PO ID"]}</td>
                  <td>{item["Line No"]}</td>
                  <td>{item.Vendor}</td>
                  <td>{item.Description}</td>
                  <td>{wbsDescriptions[item.WBS]} ({item.WBS})</td>      
                  <td>{item["Invoice ID"]}</td>
                  <td>{formatDate(item["Invoice Date"])}</td>
                  <td>{formatDate(item["Payment Date"])}</td>
                  <td>{item.Freight}</td>
                  <td>{item.Miscellaneous}</td>
                  <td>
                    {item["Invoice Amount"] !== null && item["Invoice Amount"] !== undefined
                      ? item["Invoice Amount"].toLocaleString()
                      : ""}
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
              ))}
            <tr className="table-total">
              <td colSpan="9" style={{ fontWeight: "bold" }}>
                Total:
              </td>
              <td style={{ fontWeight: "bold" }}>${calculateFreightTotal()}</td>
              <td style={{ fontWeight: "bold" }}>${calculateMiscellaneousTotal()}</td>
              <td style={{ fontWeight: "bold" }}>${calculateInvoiceAmountTotal()}</td>
              <td></td> {/* For the "Edit" button column */}
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

export default InvoiceTable;
