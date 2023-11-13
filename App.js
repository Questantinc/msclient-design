import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ForecastTable from './components/FutureForecast/forecastTable';
import InvoiceTable from './components/Invoice/InvoiceTable';
import PurchaseTable from './components/PO/purchaseTable';
import NonPOTable from './components/NonPO/NonPOTable';
import Home from './components/home';
import ExceptionForecast from './components/Exceptions/ExceptionForecast';
import ExceptionsNonPO from './components/Exceptions/ExceptionsNonPO';
import ExceptionsPO from './components/Exceptions/ExceptionsPO';
import AddForm from './components/FutureForecast/addForm';
import EditForm from './components/FutureForecast/editForm';
import DeleteForm from './components/FutureForecast/deleteForm';
import EditInvoiceForm from './components/Invoice/EditInvoiceForm'
import EditPurchase from './components/PO/editPurchase';
import EditNonPO from './components/NonPO/EditNonPOForm';
import UpdatesTable from './components/Updates/UpdatesTable';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import UnAuthorizedRoute from './components/UnAuthorizedRoute';
import jwt_decode from 'jwt-decode';
import RequestForm from './components/RequestWorkflow/RequestForm';
import SimonApprovalsPage from './components/RequestWorkflow/SimonApproval';
import DerekApprovalsPage from './components/RequestWorkflow/DerekApproval';
import NickApprovalsPage from './components/RequestWorkflow/NickApproval';
import NeilApprovalsPage from './components/RequestWorkflow/NeilApproval';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthentication = (token) => {
    // Decode the token and extract user role
    const decodedToken = jwt_decode(token);
    const userRole = decodedToken.role;

    // Set isAuthenticated and userRole in state
    setIsAuthenticated(true);
    setUserRole(userRole);
  };


  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Login onAuthentication={handleAuthentication} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />} />

          <Route path="/Navbar" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Navbar email={email} userRole={userRole}/>
            </ProtectedRoute>
          } />

          <Route path="/Home" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home userRole={userRole} email={email} />
            </ProtectedRoute>
          } />

          <Route path="/FutureForecast" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ForecastTable />
            </ProtectedRoute>
          } />

          <Route path="/FutureForecast/Add" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin" >
              <AddForm email={email} />
            </ProtectedRoute>
          } />

          <Route path="/FutureForecast/Edit" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole={['admin', 'editor']} >
              <EditForm email={email} userRole={userRole} />
            </ProtectedRoute>
          } />

          <Route path="/FutureForecast/Delete" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin">
              <DeleteForm />
            </ProtectedRoute>
          } />

          <Route path="/Invoices" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <InvoiceTable />
            </ProtectedRoute>
          } />

          <Route path="/Invoices/Edit" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole={['admin', 'editor']} >
              <EditInvoiceForm email={email} userRole={userRole} />
            </ProtectedRoute>
          } />

          <Route path="/POTable" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PurchaseTable />
            </ProtectedRoute>
          } />

          <Route path="/POTable/Edit" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole={['admin', 'editor']} >
              <EditPurchase email={email} userRole={userRole} />
            </ProtectedRoute>
          } />

          <Route path="/NonPOTable" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NonPOTable />
            </ProtectedRoute>
          } />

          <Route path="/NonPOTable/Edit" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole={['admin', 'editor']} >
              <EditNonPO email={email} userRole={userRole} />
            </ProtectedRoute>
          } />

          <Route path="/ExceptionForecast" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ExceptionForecast />
            </ProtectedRoute>
          } />

          <Route path="/ExceptionPO" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ExceptionsPO />
            </ProtectedRoute>
          } />

          <Route path="/ExceptionNonPO" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ExceptionsNonPO />
            </ProtectedRoute>
          } />

          <Route path="/UpdatesTable" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UpdatesTable />
            </ProtectedRoute>
          } />

          <Route path="/Requests" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RequestForm email={email} />
            </ProtectedRoute>
          } />

          <Route path="/simon-approvals" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} >
              {email === 'simon@questantinc.com' ? (
                <SimonApprovalsPage email={email} />
              ) : (
                <UnAuthorizedRoute />
              )}
            </ProtectedRoute>
          } />
          <Route path="/derek-approvals" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} >
              {email === 'Derek.haddad@michigansugar.com' ? (
                <DerekApprovalsPage email={email} />
              ) : (
                <UnAuthorizedRoute />
              )}
            </ProtectedRoute>
          } />

          <Route path="/nick-approvals" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} >
              {email === 'Nick.Klein@michigansugar.com' ? (
                <NickApprovalsPage email={email}/>
              ) : (
                <UnAuthorizedRoute />
              )}
            </ProtectedRoute>
          } />

          <Route path="/neil-approvals" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} >
              {email === 'Neil.Juhnke@michigansugar.com' ? (
                <NeilApprovalsPage email={email} />
              ) : (
                <UnAuthorizedRoute />
              )}
            </ProtectedRoute>
          } />

          <Route path="/UnAuthorizedRoute" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UnAuthorizedRoute />
            </ProtectedRoute>
          } />

        </Routes>


      </Router>
    </div>
  );
}

export default App;
