const axios = require("axios");

exports.handler = async (event) => {
  const path = event.path.replace("/api", "");
  const query = event.queryStringParameters
    ? new URLSearchParams(event.queryStringParameters).toString()
    : "";
  const apiUrl = `https://assignment.devotel.io/api${path}${
    query ? `?${query}` : ""
  }`;
  const method = event.httpMethod.toLowerCase();
  const body = event.body ? JSON.parse(event.body) : null;

  try {
    const response = await axios({
      method: method,
      url: apiUrl,
      data: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 400, // کد خطا رو درست برگردون
      body: JSON.stringify({
        error: error.response?.data?.message || "خطا در گرفتن دیتا",
      }),
      headers: {
        "Content-Type": "application/json", // مطمئن شو JSON برگرده
      },
    };
  }
};
