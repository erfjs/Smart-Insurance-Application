
import { api } from "./axios";


export const fetchFormStructure = async () => {
	const response = await api.get("/api/insurance/forms");
	return response.data;
};

export const submitForm = async (data: any) => {
	const response = await api.post("/api/insurance/forms/submit", data);
	return response.data;
};