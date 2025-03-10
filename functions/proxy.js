const axios = require("axios");

exports.handler = async (event) => {
  const path = event.path.replace("/api", "/api"); // مسیر رو نگه می‌داره
  const apiUrl = `https://assignment.devotel.io${path}`;

  try {
    const response = await axios.get(apiUrl);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // برای دور زدن CORS
      },
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ error: "خطا در گرفتن دیتا" }),
    };
  }
};
