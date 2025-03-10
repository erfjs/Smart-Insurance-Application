import { api } from "./axios";

export const fetchFormStructure = async () => {
	try {
		const response = await api.get("/api/insurance/forms");
		return response.data;
	} catch (error) {
		throw new Error("خطا در گرفتن ساختار فرم: " + error.message);
	}
};

export const submitForm = async (data: any) => {
	try {
		const response = await api.post("/api/insurance/forms/submit", data, {
			headers: { "Content-Type": "application/json" },
		});
		return response.data;
	} catch (error) {
		throw new Error("خطا در ارسال فرم: " + error.message);
	}
};