// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientRegistration from './components/PatientRegistration';
import TestResultsForm from './components/TestResultsForm';



import DashboardLayout from './components/DashboardLayout';
import TestsTable from './components/TestsTable';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import RegisterAdmin from './components/RegisterAdmin';
import PatientEdit from './components/PatientEdit';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>

                <ProtectedRoute>
                    <DashboardLayout>

                        <Routes>

                            <Route path="/" element={
                                <ProtectedRoute>
                                    <TestsTable />
                                </ProtectedRoute>} />
                            <Route
                                path="/PatientRegistration"
                                element={
                                    <ProtectedRoute>
                                        <PatientRegistration />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/test-results/:patientId"
                                element={
                                    <ProtectedRoute>
                                        <TestResultsForm />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/register"
                                element={
                                    <ProtectedRoute>
                                        <RegisterAdmin />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/patientedit/:id"
                                element={
                                    <ProtectedRoute>
                                        <PatientEdit />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </DashboardLayout>
                </ProtectedRoute>
            </Router>
        </AuthProvider >
    );
}






export default App;

