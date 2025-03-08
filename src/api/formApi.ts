import axios from 'axios';

export const fetchFormStructure = async () => {
	const response = await axios.get('/api/insurance/forms');
	return response.data;
};

export const submitForm = async (data: any) => {
	const response = await axios.post('/api/insurance/forms/submit', data);
	return response.data;
};