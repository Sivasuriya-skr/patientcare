import axiosInstance from './axiosInstance';

export const getBillingAccounts = async () => {
  const response = await axiosInstance.get('/api/billing/accounts');
  return response.data;
};

export const getBillingAccountByPatientId = async (patientId) => {
  const response = await axiosInstance.get(`/api/billing/accounts/patient/${patientId}`);
  return response.data;
};
