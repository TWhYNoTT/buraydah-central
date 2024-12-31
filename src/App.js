// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientRegistration from './components/PatientRegistration';
import TestResultsForm from './components/TestResultsForm';
import DashboardLayout from './components/DashboardLayout';
import TestsTable from './components/TestsTable';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import RegisterAdmin from './components/RegisterAdmin';
import PatientEdit from './components/PatientEdit';
import ScannerPage from './components/ScannerPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected routes wrapped in DashboardLayout */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<TestsTable />} />
                        <Route path="/PatientRegistration" element={<PatientRegistration />} />
                        <Route path="/test-results/:patientId" element={<TestResultsForm />} />
                        <Route path="/register" element={<RegisterAdmin />} />
                        <Route path="/patientedit/:id" element={<PatientEdit />} />
                        <Route path="/scanner" element={<ScannerPage />} />

                        {/* Catch all route - redirect to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;