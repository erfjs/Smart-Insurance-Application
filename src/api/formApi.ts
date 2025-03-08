import axios from 'axios';

export const fetchFormStructure = async () => {
	const response = await axios.get('https://assignment.devotel.io/api/insurance/forms');
	return response.data;
};

export const submitForm = async (data: any) => {
	const response = await axios.post('https://assignment.devotel.io/api/insurance/forms/submit', data);
	return response.data;
};