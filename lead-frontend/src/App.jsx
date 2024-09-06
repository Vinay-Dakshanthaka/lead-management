// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Overview from './components/main/Overview';
import Reports from './components/main/Reports';
import './index.css'
import './App.css'
import LeadForm from './components/main/manageLead/LeadForm';
import UploadLeads from './components/main/UploadLeads';
import JoinedCandidatesTable from './components/main/manageLead/JoinedCandidatesTable';
import LeadDashboard from './components/main/LeadDashboard';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Routes>
          <Route path="/overview" element={<Overview />} />
          <Route path="/dashboard" element={<LeadDashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/lead-form/:lead_id" element={<LeadForm />} />
          <Route path="/upload-leads" element={<UploadLeads />} />
          <Route path="/joined-leads" element={<JoinedCandidatesTable />} />
          <Route path="/add-new" element={<LeadForm />} />
          <Route path="/" element={<Overview />} exact />
        </Routes>
      </main>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;
