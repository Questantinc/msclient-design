import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { saveAs } from 'file-saver';
import axios from 'axios';

function Home(props) {
  const [combinedData, setCombinedData] = useState([]);
  const { userRole } = props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          budgetResponse,
          totalForecastResponse,
          contractedTotalResponse,
          invoiceTotalResponse,
          futureForecastResponse,
          requestTotalResponse,
          
        ] = await Promise.all([
          axios.get('https://44.217.202.126/api/costreport/budget'),
          axios.get('https://44.217.202.126/api/costreport/totalforecast'),
          axios.get('https://44.217.202.126/api/costreport/contractedtotal'),
          axios.get('https://44.217.202.126/api/costreport/invoicetotal'),
          axios.get('https://44.217.202.126/api/costreport/futureforecasttotal'),
          axios.get('https://44.217.202.126/api/costreport/requesttotal'),

        ]);

        const combinedData = combineData(
          budgetResponse.data,
          totalForecastResponse.data,
          contractedTotalResponse.data,
          invoiceTotalResponse.data,
          futureForecastResponse.data.map((item) => ({ ...item, futureForecast: item.total })),
          requestTotalResponse.data,

        );
          console.log('Data from server',requestTotalResponse.data)
          console.log('Data from server 1',invoiceTotalResponse.data)
        setCombinedData(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  const customSort = (a, b) => {
    const order = [
      'Molasses DeSugarization',
      'Molasses Unloading',
      'Juice Softening Caro',
      'Juice Softening Sebewaing',
      'Project Management and Cost Control',
      'Design Change Orders',
      'Project Risk and Scope Contingency',
      'CEO Contingency'
    ];

    return order.indexOf(a['Project Name']) - order.indexOf(b['Project Name']);
  };

  const combineData = (budgetData, totalForecastData, contractedTotalData, invoiceTotalData,  futureForecastData, requestTotalData) => {
    const combinedData = {};

    const mergeData = (data) => {
      data.forEach((item) => {
        const projectName = item['Project Name'];
        const wbsDescription = item['WBS Description'];

        // If WBS Description is empty or null, use "Unallocated" category
        const key = `${projectName}_${wbsDescription || ' '}`;

        if (!combinedData[key]) {
          combinedData[key] = {
            'Project Name': projectName,
            'WBS Description': wbsDescription,
            budget: 0,
            total_forecast: 0,
            contracted_total: 0,
            invoice_total: 0,
            futureForecast: 0,
            po_total: 0,
          };
        }

        // Convert data from string to integer and add them
        combinedData[key].budget += parseFloat(item.budget, 10) || 0;
        combinedData[key].total_forecast += parseFloat(item.total_forecast, 10) || 0;
        combinedData[key].contracted_total += parseFloat(item.contracted_total, 10) || 0;
        combinedData[key].invoice_total += parseFloat(item.invoice_total, 10) || 0;
        combinedData[key].futureForecast += parseFloat(item.futureForecast, 10) || 0;
        combinedData[key].po_total += parseFloat(item.po_total, 10) || 0;
      });
    };

    mergeData(budgetData);
    mergeData(totalForecastData);
    mergeData(contractedTotalData);
    mergeData(invoiceTotalData);
    mergeData(requestTotalData);



    // Handling the "futureForecast" data separately
    futureForecastData.forEach((item) => {
      const projectName = item['Project Name'];
      const wbsDescription = item['WBS Description'];

      // If WBS Description is empty or null, use "Unallocated" category
      const key = `${projectName}_${wbsDescription || 'Unallocated'}`;

      if (!combinedData[key]) {
        combinedData[key] = {
          'Project Name': projectName,
          'WBS Description': wbsDescription || 'Unallocated',
          budget: 0,
          total_forecast: 0,
          contracted_total: 0,
          invoice_total: 0,
          futureForecast: item.futureForecast,
          po_total: 0,
        };
      } else {
        combinedData[key].futureForecast = item.futureForecast;
      }
    });

    // Remove rows with missing WBS Description
    const filteredData = Object.values(combinedData).filter((item) => item['WBS Description']);

    // Sort the data based on the customSort function
    const sortedData = filteredData.sort(customSort);

    return sortedData;
  };

  const formatBudget = (value) => {
    if (value !== null && value !== undefined) {
      const roundedValue = Math.round(value);
      // Display the rounded value without decimal places
      return roundedValue !== 0 ? roundedValue.toLocaleString('en-US') : ' ';
    }
    return ' ';
  };

  const calculateSubtotals = (data) => {
    const subtotals = {};

    data.forEach((item) => {
      const projectName = item['Project Name'];
      const key = projectName || 'Unallocated';

      if (!subtotals[key]) {
        subtotals[key] = {
          budget: 0,
          total_forecast: 0,
          contracted_total: 0,
          invoice_total: 0,
          futureForecast: 0,
          po_total: 0,
        };
      }

      subtotals[key].budget += parseFloat(item.budget, 10) || 0;
      subtotals[key].total_forecast += parseFloat(item.total_forecast, 10) || 0;
      subtotals[key].contracted_total += parseFloat(item.contracted_total, 10) || 0;
      subtotals[key].invoice_total += parseFloat(item.invoice_total, 10) || 0;
      subtotals[key].futureForecast += parseFloat(item.futureForecast, 10) || 0;
      subtotals[key].po_total += parseFloat(item.po_total, 10) || 0;
    });

    return subtotals;
  };

  const calculateGrandTotal = (subtotals) => {
    const grandTotal = {
      budget: 0,
      total_forecast: 0,
      contracted_total: 0,
      invoice_total: 0,
      futureForecast: 0,
      po_total: 0,
    };

    Object.values(subtotals).forEach((subtotal) => {
      grandTotal.budget += subtotal.budget;
      grandTotal.total_forecast += subtotal.total_forecast;
      grandTotal.contracted_total += subtotal.contracted_total;
      grandTotal.invoice_total += subtotal.invoice_total;
      grandTotal.futureForecast += subtotal.futureForecast;
      grandTotal.po_total += subtotal.po_total;

    });

    return grandTotal;
  };

  if (!combinedData.length) {
    return <div>Loading...</div>;
  }

  const subtotals = calculateSubtotals(combinedData);
  const grandTotal = calculateGrandTotal(subtotals);

  console.log('Data from mergedata',subtotals)

  // Define the renderSubtotalRow function
  const renderSubtotalRow = (projectName, subtotalData) => {
    return (
      <tr>
        <td style={{ fontWeight: 'bold' }}>{projectName}</td>
        <td style={{ fontWeight: 'bold' }}>Subtotal</td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(subtotalData.budget)}</td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(subtotalData.total_forecast)}</td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(subtotalData.contracted_total)}</td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(subtotalData.invoice_total)}</td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(subtotalData.futureForecast)}</td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(subtotalData.po_total)}</td>

      </tr>
    );
  };

  // Define the renderGrandTotalRow function
  const renderGrandTotalRow = (grandTotalData) => {
    return (
      <tr>
        <td style={{ fontWeight: 'bold' }}>Grand Total</td>
        <td></td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(grandTotalData.budget)}</td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(grandTotalData.total_forecast)}</td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(grandTotalData.contracted_total)}</td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(grandTotalData.invoice_total)}</td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(grandTotalData.futureForecast)}</td>
        <td style={{ fontWeight: 'bold' }}>{formatBudget(grandTotalData.po_total)}</td>

      </tr>
    );
  };

  const downloadCSV = () => {
    const csvRows = [];

    // Create the CSV header row
    const headers = ['Project Name', 'WBS Description', 'Budget', 'Total Forecast', 'Contracted Total', 'Invoice Total', 'Future Forecast', 'Request Total'];
    csvRows.push(headers.join(','));

    // Add table data rows to CSV
    combinedData.forEach((item) => {
      const row = [
        item['Project Name'],
        item['WBS Description'],
        item.budget,
        item.total_forecast,
        item.contracted_total,
        item.invoice_total,
        item.futureForecast,
        item.po_total
      ];
      csvRows.push(row.join(','));
    });

    // Combine rows into a CSV string
    const csvContent = csvRows.join('\n');

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Save the Blob as a file
    saveAs(blob, 'table_data.csv');
  };


  return (
    <div className="home-container">
      <Navbar />
      <h2>Cost Summary Report</h2>
      {userRole.trim() === 'admin' && (
        <div className="download-button-container">
          <button onClick={downloadCSV}>Download Report</button>
        </div>
      )}

      <div className="report-container">
        <table className="shrink-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Project Name</th>
              <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>WBS Description</th>
              <th>Budget</th>
              <th>Total Forecast</th>
              <th>Contracted Total</th>
              <th>Invoice Total</th>
              <th>Future Forecast</th>
              <th>Request Total</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.map((item, index) => (
              <React.Fragment key={index}>
                {index === 0 || combinedData[index - 1]['Project Name'] !== item['Project Name'] ? (
                  <>
                    {index !== 0 && renderSubtotalRow(combinedData[index - 1]['Project Name'], subtotals[combinedData[index - 1]['Project Name']])}
                    <tr>
                      <td rowSpan={combinedData.filter((data) => data['Project Name'] === item['Project Name']).length}>
                        {item['Project Name']}
                      </td>
                      <td>{item['WBS Description']}</td>
                      <td>{formatBudget(item.budget)}</td>
                      <td>{formatBudget(item.total_forecast)}</td>
                      <td>{formatBudget(item.contracted_total)}</td>
                      <td>{formatBudget(item.invoice_total)}</td>
                      <td>{formatBudget(item.futureForecast)}</td>
                      <td>{formatBudget(item.po_total)}</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td>{item['WBS Description']}</td>
                    <td>{formatBudget(item.budget)}</td>
                    <td>{formatBudget(item.total_forecast)}</td>
                    <td>{formatBudget(item.contracted_total)}</td>
                    <td>{formatBudget(item.invoice_total)}</td>
                    <td>{formatBudget(item.futureForecast)}</td>
                    <td>{formatBudget(item.po_total)}</td>
                  </tr>
                )}
                {index === combinedData.length - 1 && renderSubtotalRow(item['Project Name'], subtotals[item['Project Name']])}
              </React.Fragment>
            ))}
            {renderGrandTotalRow(grandTotal)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;


