// src/services/api.js
const API_BASE_URL = 'https://localhost:7148/api';


const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};



export const savePatient = async (patientData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Patient`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(patientData)
        });

        if (!response.ok) {
            throw new Error(`Failed to save patient: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error in savePatient:', error);
        throw error;
    }
};

export const savePathologyAnalysis = async (analysisData) => {
    try {
        console.log('Saving analysis:', analysisData); // Debug log

        const response = await fetch(`${API_BASE_URL}/Pathology_Analyses_`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(analysisData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText); // Debug log
            throw new Error(`Failed to save analysis: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error in savePathologyAnalysis:', error);
        throw error;
    }
};

export const getPatientData = async (patientId) => {

    const response = await fetch(`${API_BASE_URL}/Patient/${patientId}`,
        {
            method: 'GET',
            headers: getAuthHeaders(),

        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch patient data');
    }

    return response.json();
};

export const updatePathologyAnalysis = async (analysisId, data) => {
    const response = await fetch(`${API_BASE_URL}/Pathology_Analyses_/${analysisId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to update analysis results');
    }

    return response.json();
};




const getHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (includeAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

// Authentication APIs
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
    const response = await fetch(`${API_BASE_URL}/Account`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(adminData)
    });

    if (!response.ok) {
        throw new Error('Failed to register admin');
    }

    return response.json();
};





export const getAllPatients = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Patient`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch patients');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
};

export const deletePatient = async (id) => {
    const response = await fetch(`${API_BASE_URL}/Patient/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete test');
    return response;
};

export const updateTest = async (id, testData) => {
    const response = await fetch(`${API_BASE_URL}/pathology_analysis/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(testData)
    });
    if (!response.ok) throw new Error('Failed to update test');
    return response.json();
};


export const getPatientById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Patient/${id}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch patient data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching patient:', error);
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

        if (!response.ok) {
            throw new Error('Failed to update patient');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating patient:', error);
        throw error;
    }
};