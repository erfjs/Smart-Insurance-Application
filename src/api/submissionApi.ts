import { api } from './axios';

export const fetchSubmissions = async () => {
	const response = await api.get('/api/insurance/forms/submissions', { headers: { "Content-Type": "application/json" }, });
	return response.data;
};              
