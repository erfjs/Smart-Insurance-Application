
// import { api } from "./axios";


// export const fetchFormStructure = async () => {
// 	const response = await api.get("/api/insurance/forms");
// 	return response.data;
// };

// export const submitForm = async (data: any) => {
// 	const response = await api.post("/api/insurance/forms/submit", data);
// 	return response.data;
// };


import axios from "axios";

export const api = axios.create();

export const fetchFormStructure = async () => {
	const response = await api.get("/api/insurance/forms");
	return response.data;
};

export const submitForm = async (data: any) => {
	const response = await api.post("/api/insurance/forms/submit", {
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	return response.data;
};