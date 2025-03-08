import axios from 'axios';

export const fetchSubmissions = async () => {
	const response = await axios.get('/api/insurance/forms/submissions');
	return response.data;
};