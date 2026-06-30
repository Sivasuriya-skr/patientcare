import axiosInstance from './axiosInstance';

/**
 * GET /api/patients
 * Returns: array of patients
 */
export const getPatients = async () => {
  const response = await axiosInstance.get('/api/patients');
  return response.data;
};

/**
 * GET /api/patients/:id
 * Returns: single patient object
 */
export const getPatientById = async (id) => {
  const response = await axiosInstance.get(`/api/patients/${id}`);
  return response.data;
};

/**
 * POST /api/patients  (goes to patient-service via gateway)
 * Body: { name, address, email, dateOfBirth, registeredDate }
 * Returns: created patient
 */
export const createPatient = async (patientData) => {
  const response = await axiosInstance.post('/api/patients', patientData);
  return response.data;
};

/**
 * PUT /api/patients/:id
 * Body: { name, address, email, dateOfBirth }
 * Returns: updated patient
 */
export const updatePatient = async (id, patientData) => {
  const response = await axiosInstance.put(`/api/patients/${id}`, patientData);
  return response.data;
};

/**
 * DELETE /api/patients/:id
 */
export const deletePatient = async (id) => {
  const response = await axiosInstance.delete(`/api/patients/${id}`);
  return response.data;
};
