// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import LeadDashboard from './LeadDashboard';
// import Overview from './Overview';
// import Reports from './Reports';
// import LeadForm from './manageLead/LeadForm';
// import UploadLeads from './UploadLeads';
// import JoinedCandidatesTable from './manageLead/JoinedCandidatesTable';
// import AdminDashboard from './admin/AdminDashboard';
// import CounsellorDashboard from './counsellor/CounsellorDashboard';
// import SignInForm from './auth/SignInForm';
// import CounsellorsDetails from './admin/CounsellorDetails';
// import CounsellorLeads from './admin/CounsellorLeads';
// import LeadsAndCounsellors from './admin/LeadsAndCounsellors';
// import ResetPasswordEmail from './auth/ResetPasswordEmail';
// import ResetPassword from './auth/ResetPassword';
// import UpdateLeadForm from './manageLead/UpdateLeadForm';
// import SignUpWithDummyPassword from './auth/SignUpWithDummyPassword';
// import ReassignLeadToCounsellor from './admin/ReassignLeadToCounsellor';
// import UpdatePasswordForm from './auth/UpdatePasswordForm';

// const Main = ({ role }) => {
//   return (
//     <main className="py-3">
//       <Routes>
//         <Route path="/overview" element={<Overview />} />
//         <Route path="/reports" element={<Reports />} />
//         <Route path="/lead-form/:lead_id" element={<LeadForm />} />
//         <Route path="/joined-leads" element={<JoinedCandidatesTable />} />
//         <Route path="/add-new" element={<LeadForm />} />

//         {/* Admin routes */}
//         {role === 'ADMIN' && (
//           <>
//             <Route path="/admin-dashboard" element={<AdminDashboard />} />
//             <Route path="/upload-leads" element={<UploadLeads />} />
//             <Route path="/counsellor-details" element={<CounsellorsDetails />} />
//             <Route path="/counsellor-leads/:counsellor_id" element={<CounsellorLeads />} />
//             <Route path="/leads" element={<LeadsAndCounsellors />} />
//             <Route path="/assign-lead-to-counsellor" element={<ReassignLeadToCounsellor />} />
//           </>
//         )}

//         {/* Counsellor routes */}
//         {role === 'COUNSELLOR' && (
//           <>
//             <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
//           </>
//         )}

//         {/* Auth routes */}
//         <Route path="/create-account-counsellor" element={<SignUpWithDummyPassword />} />
//         <Route path="/sign-in" element={<SignInForm />} />
//         <Route path="/forgot-password" element={<ResetPasswordEmail />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/" element={<SignInForm />} />
//         <Route path="/update-lead/:lead_id" element={<UpdateLeadForm />} />
//         <Route path="/update-password" element={<UpdatePasswordForm />} />

//         {/* Catch-All 404 Route */}
//         <Route path="*" element={<h1>404 - Page Not Found</h1>} />
//       </Routes>
//     </main>
//   );
// };

// export default Main;


import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Overview from './Overview';
import Reports from './Reports';
import LeadForm from './manageLead/LeadForm';
import UploadLeads from './UploadLeads';
import JoinedCandidatesTable from './manageLead/JoinedCandidatesTable';
import AdminDashboard from './admin/AdminDashboard';
import CounsellorDashboard from './counsellor/CounsellorDashboard';
import SignInForm from './auth/SignInForm';
import CounsellorsDetails from './admin/CounsellorDetails';
import CounsellorLeads from './admin/CounsellorLeads';
import LeadsAndCounsellors from './admin/LeadsAndCounsellors';
import ResetPasswordEmail from './auth/ResetPasswordEmail';
import ResetPassword from './auth/ResetPassword';
import UpdateLeadForm from './manageLead/UpdateLeadForm';
import SignUpWithDummyPassword from './auth/SignUpWithDummyPassword';
import ReassignLeadToCounsellor from './admin/ReassignLeadToCounsellor';
import UpdatePasswordForm from './auth/UpdatePasswordForm';
import ProtectedRoute from '../header/ProtectedRoute';
import UpdateCounsellorDetails from './counsellor/UpdateCounsellorDetails';

const Main = ({ role, isLoggedIn, passwordUpdated }) => {
  return (
    <main className="py-3">
      <Routes>
        {/* Common Routes */}
        <Route path="/overview" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
            <Overview />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/lead-form/:lead_id" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
            <LeadForm />
          </ProtectedRoute>
        } />
        <Route path="/joined-leads" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
            <JoinedCandidatesTable />
          </ProtectedRoute>
        } />
        <Route path="/update-profile" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
            <UpdateCounsellorDetails />
          </ProtectedRoute>
        } />
        <Route path="/add-new" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
            <LeadForm />
          </ProtectedRoute>
        } />
        <Route path="/update-lead/:lead_id" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
            <UpdateLeadForm />
          </ProtectedRoute>
        } />
        <Route path="/update-password" element={<UpdatePasswordForm />} />

        {/* Admin Routes */}
        {role === 'ADMIN' && (
          <>
            <Route path="/admin-dashboard" element={
              <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/upload-leads" element={
              <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
                <UploadLeads />
              </ProtectedRoute>
            } />
            <Route path="/counsellor-details" element={
              <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
                <CounsellorsDetails />
              </ProtectedRoute>
            } />
            <Route path="/counsellor-leads/:counsellor_id" element={
              <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
                <CounsellorLeads />
              </ProtectedRoute>
            } />
            <Route path="/leads" element={
              <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
                <LeadsAndCounsellors />
              </ProtectedRoute>
            } />
            <Route path="/assign-lead-to-counsellor" element={
              <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
                <ReassignLeadToCounsellor />
              </ProtectedRoute>
            } />
          </>
        )}

        {/* Counsellor Routes */}
        {role === 'COUNSELLOR' && (
          <Route path="/counsellor-dashboard" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated}>
              <CounsellorDashboard />
            </ProtectedRoute>
          } />
        )}

        {/* Auth Routes */}
        <Route path="/create-account-counsellor" element={<SignUpWithDummyPassword />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/forgot-password" element={<ResetPasswordEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<SignInForm />} />

        {/* Catch-All 404 Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </main>
  );
};

export default Main;

