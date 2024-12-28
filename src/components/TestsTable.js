import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Edit,
    Trash,
    QrCode,
    X,
    Eye,
    Printer
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getAllPatients, deletePatient } from '../services/api';
import ViewModal from './VM';



const PatientsTable = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [showQR, setShowQR] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);


    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await getAllPatients();
            setPatients(data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch patients');
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleView = (patient) => {
        setSelectedPatient(patient);
        setShowViewModal(true);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const filteredPatients = patients.filter(patient =>
        patient.UniqNumber.toString().includes(searchTerm) ||
        patient.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        try {
            await deletePatient(id);
            setPatients(patients.filter(patient => patient.Id !== id));
            setShowDeleteModal(false);
            setPatientToDelete(null);
            setError(null);
        } catch (error) {
            setError('Failed to delete patient');
            console.error('Error deleting patient:', error);
        }
    };

    const handleEdit = (patientId) => {
        navigate(`/patientedit/${patientId}`);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Patient QR Code</title>
                    <style>
                        .qr-container {
                            text-align: center;
                            padding: 20px;
                        }
                        .patient-info {
                            margin-top: 20px;
                            font-family: Arial, sans-serif;
                        }
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        <div id="qr-code"></div>
                        <div class="patient-info">
                            <h2>Patient ID: ${selectedPatient?.Id}</h2>
                            <p>Name: ${selectedPatient?.Name}</p>
                            <p>Unique Number: ${selectedPatient?.UniqNumber}</p>
                        </div>
                    </div>
                </body>
            </html>
        `);

        const qrCode = document.getElementById('qr-code-for-print').cloneNode(true);
        printWindow.document.getElementById('qr-code').appendChild(qrCode);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };


    const DeleteConfirmationModal = ({ patient, onClose, onConfirm }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="mb-6">
                    <p className="text-gray-600">Are you sure you want to delete the patient:</p>
                    <p className="font-medium mt-2">{patient.Name}</p>
                    <p className="text-sm text-gray-500">ID: {patient.Id}</p>
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(patient.Id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    const QRModal = ({ patient, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Patient QR Code</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex justify-center" id="qr-code-for-print">
                    <QRCodeSVG value={`${window.location.origin}/test-results/${patient.Id}`} size={200} />
                </div>
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={handlePrint}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Print QR Code
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Patients Management</h2>
                </div>

                <div className="mt-4 flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search by Patient ID or Name..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gender
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Age
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unique Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created Date
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">Loading...</td>
                            </tr>
                        ) : filteredPatients.map((patient) => (
                            <tr key={patient.Id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {patient.Id}
                                </td>
                                <td className="px-6 py-4">
                                    {patient.Name}
                                </td>
                                <td className="px-6 py-4">
                                    {patient.Gender}
                                </td>
                                <td className="px-6 py-4">
                                    {patient.Age}
                                </td>
                                <td className="px-6 py-4">
                                    {patient.UniqNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(patient.CreatedTime).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-center space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedPatient(patient);
                                            setShowQR(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="QR Code"
                                    >
                                        <QrCode className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleView(patient)}
                                        className="text-purple-600 hover:text-purple-800"
                                        title="View Details"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(patient.Id)}
                                        className="text-green-600 hover:text-green-800"
                                        title="Edit Patient"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPatientToDelete(patient);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete Patient"
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {error && (
                <div className="p-4 text-red-500 text-center">
                    {error}
                </div>
            )}

            {showQR && selectedPatient && (
                <QRModal
                    patient={selectedPatient}
                    onClose={() => {
                        setShowQR(false);
                        setSelectedPatient(null);
                    }}
                />
            )}

            {showDeleteModal && patientToDelete && (
                <DeleteConfirmationModal
                    patient={patientToDelete}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setPatientToDelete(null);
                    }}
                    onConfirm={handleDelete}
                />
            )}

            {showViewModal && selectedPatient && (
                <ViewModal
                    patient={selectedPatient}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedPatient(null);
                    }}
                />
            )}
        </div>
    );
};

export default PatientsTable;