import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { BiAddToQueue } from "react-icons/bi";
import { BiEditAlt } from "react-icons/bi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ForecastTable() {
  const [DBdata, setDBData] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // Default to the first page
  const [wbsFilter, setWbsFilter] = useState("");
  const [wbsOptions, setWbsOptions] = useState([]);
  const [buildingRefFilter, setBuildingRefFilter] = useState("");
  const [buildingRefOptions, setBuildingRefOptions] = useState([]);
  const location = useLocation();

  useEffect(() => {
    axios
      .get("https://44.217.202.126/api/data")
      .then((response) => {
        setDBData(response.data);
        setWbsOptions([...new Set(response.data.map((item) => item.WBS))]);
        setBuildingRefOptions([
          ...new Set(response.data.map((item) => item["Building Reference"]))
        ]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = parseInt(searchParams.get("page"));
    if (!isNaN(pageParam) && pageParam > 0) {
      setCurrentPage(pageParam);
    } else {
      // If "page" query parameter is not present, default to page 1
      setCurrentPage(1);
    }
  }, [location.search]);

  useEffect(() => {
    if (wbsFilter !== "") {
      const filteredBuildingRefs = [
        ...new Set(
          DBdata.filter((item) => item.WBS === wbsFilter).map(
            (item) => item["Building Reference"]
          )
        )
      ];
      setBuildingRefOptions(filteredBuildingRefs);
    } else {
      // If no WBS filter is selected, show all Building References
      const allBuildingRefs = [
        ...new Set(DBdata.map((item) => item["Building Reference"]))
      ];
      setBuildingRefOptions(allBuildingRefs);
    }
  }, [wbsFilter, DBdata]);

  // Filter the available WBS options based on the selected Building Reference
  useEffect(() => {
    if (buildingRefFilter !== "") {
      const filteredWBSOptions = [
        ...new Set(
          DBdata.filter((item) => item["Building Reference"] === buildingRefFilter).map(
            (item) => item.WBS
          )
        )
      ];
      setWbsOptions(filteredWBSOptions);
    } else {
      // If no Building Reference filter is selected, show all WBS options
      const allWBSOptions = [
        ...new Set(DBdata.map((item) => item.WBS))
      ];
      setWbsOptions(allWBSOptions);
    }
  }, [buildingRefFilter, DBdata]);


  // Create a mapping object for WBS values and their corresponding descriptions
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

  const handleEdit = (rowData) => {
    // navigate("/FutureForecast/Edit", { state: { rowData } });
    console.log('Current Page:', currentPage);
    navigate(`/FutureForecast/Edit?page=${currentPage}`, { state: { rowData } });
  };

  const handleDelete = rowData => {
    navigate("/FutureForecast/Delete", { state: { rowData } });
  };

  const handleWbsFilterChange = event => {
    const selectedWbs = event.target.value;
    setWbsFilter(selectedWbs);

  };

  const handleBuildingRefFilterChange = event => {
    const selectedBuildingReference = event.target.value;
    setBuildingRefFilter(selectedBuildingReference);
  };

  const filteredData =
    wbsFilter === "" && buildingRefFilter === ""
      ? DBdata
      : DBdata.filter(
        item =>
          (wbsFilter === "" || item.WBS === wbsFilter) &&
          (buildingRefFilter === "" ||
            item["Building Reference"] === buildingRefFilter)
      );

  // Sort the filteredData based on FID in descending order
  filteredData.sort((a, b) => b.FID - a.FID);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const calculateTotal = () => {
    const total = filteredData.reduce(
      (sum, item) => sum + (item["Forecast Amount"] || 0),
      0
    );
    return total.toLocaleString();
  };


  return (
    <div>
      <Navbar />
      <h1 className="table-header">Future Forecast Table</h1>
      <div className="form-btn-container">
        <div className="form-icon-btn-container">
          <Link to="/FutureForecast/Add">
            <BiAddToQueue size={32} />
            <button className="add-btn form-btn">Add Forecast</button>
          </Link>
        </div>
      </div>
      <div className="filter-container">
        <span>WBS:</span>
        <select
          id="wbsFilter"
          value={wbsFilter}
          onChange={handleWbsFilterChange}
        >
          <option value="">All WBS</option>
          {wbsOptions.map(wbs => (
            <option key={wbs} value={wbs}>
              {wbsDescriptions[wbs]} ({wbs})
            </option>
          ))}
        </select>

        <span>Building Reference:</span>
        <select
          id="buildingRefFilter"
          value={buildingRefFilter}
          onChange={handleBuildingRefFilterChange}
        >
          <option value="">All Building References</option>
          {buildingRefOptions.map(buildingRef => (
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
              <th>Purchase From</th>
              <th>Description</th>
              <th>Notes</th>
              <th>WBS</th>
              <th>Building Reference</th>
              <th>Forecast Type</th>
              <th>Forecast Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
              .map((item) => (
                <tr key={item.FID}>
                  <td>{item["Project ID"]}</td>
                  <td>{item["Purchase From"]}</td>
                  <td>{item.Description}</td>
                  <td>{item.Notes}</td>
                  <td>
                    {wbsDescriptions[item.WBS]} ({item.WBS})
                  </td>
                  <td>{item["Building Reference"]}</td>
                  <td>{item["Forecast Type"]}</td>
                  <td>
                    {item["Forecast Amount"] !== null
                      ? item["Forecast Amount"].toLocaleString()
                      : null}
                  </td>
                  <td className="notes-column">
                    <button
                      onClick={() => handleEdit(item)}
                      className="edit-btn form-btn"
                    >
                      <BiEditAlt size={24} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="edit-btn form-btn"
                    >
                      <MdOutlineDeleteForever size={24} />
                    </button>
                  </td>
                </tr>
              ))}
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

export default ForecastTable;
