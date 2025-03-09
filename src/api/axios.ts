import axios from "axios";

const API_BASE_URL = process.env.NODE_ENV === 'development'
	? 'api'
	: 'https://assignment.devotel.io';

export const api = axios.create({
	baseURL: API_BASE_URL
});
