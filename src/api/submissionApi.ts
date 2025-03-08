import axios from 'axios';

export const fetchSubmissions = async () => {
	const response = await axios.get('https://assignment.devotel.io/api/insurance/forms/submissions');
	return response.data;
};