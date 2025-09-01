const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
      ];

  const origin = event.headers.origin || event.headers.Origin;
  const headers = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { longUrl } = JSON.parse(event.body);
    if (!longUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing longUrl" }),
      };
    }

    const tinyUrlResponse = await fetch("https://api.tinyurl.com/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TINYURL_API_TOKEN}`,
      },
      body: JSON.stringify({
        url: longUrl,
      }),
    });

    const tinyUrlData = await tinyUrlResponse.json();

    if (!tinyUrlResponse.ok) {
      throw new Error(tinyUrlData.error || "Failed to shorten URL");
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ shortUrl: tinyUrlData.data.tiny_url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
