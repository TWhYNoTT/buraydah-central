// src/services/api.js
import { isTokenExpired } from '../utils/tokenUtils';

const API_BASE_URL = 'https://abdoabudeif.runasp.net/api';

// Function to handle token expiration and logout
const handleTokenExpiration = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    // Check if token exists and is not expired
    if (!token || isTokenExpired(token)) {
        handleTokenExpiration();
        return {};
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Helper function to handle API responses
const handleApiResponse = async (response) => {
    if (response.status === 401) {
        handleTokenExpiration();
        throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
};

export const savePatient = async (patientData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Patient`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(patientData)
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Error in savePatient:', error);
        throw error;
    }
};

export const savePathologyAnalysis = async (analysisData) => {
    try {
        console.log('Saving analysis:', analysisData);

        const response = await fetch(`${API_BASE_URL}/Pathology_Analyses_`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(analysisData)
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Error in savePathologyAnalysis:', error);
        throw error;
    }
};

export const getPatientData = async (patientId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Patient/${patientId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Error in getPatientData:', error);
        throw error;
    }
};

export const updatePathologyAnalysis = async (analysisId, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Pathology_Analyses_/${analysisId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Error in updatePathologyAnalysis:', error);
        throw error;
    }
};

const getHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (includeAuth) {
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            headers['Authorization'] = `Bearer ${token}`;
        } else if (includeAuth) {
            handleTokenExpiration();
        }
    }

    return headers;
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/Account/Login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        throw new Error('Invalid credentials');
    }

    return response.json();
};

export const registerAdmin = async (adminData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Account`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(adminData)
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Error in registerAdmin:', error);
        throw error;
    }
};

export const getAllPatients = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Patient`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Error in getAllPatients:', error);
        throw error;
    }
};

export const deletePatient = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Patient/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Error in deletePatient:', error);
        throw error;
    }
};

export const updateTest = async (id, testData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/pathology_analysis/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(testData)
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Error in updateTest:', error);
        throw error;
    }
};

export const getPatientById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Patient/${id}`, {
            headers: getAuthHeaders()
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Error in getPatientById:', error);
        throw error;
    }
};

export const updatePatient = async (id, patientData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Patient/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(patientData)
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Error in updatePatient:', error);
        throw error;
    }
};