const fetch = require("node-fetch").default || require("node-fetch");

// Dynamic allowed origins from environment variable (comma-separated, e.g., 'https://your-app.vercel.app,http://localhost:5500')
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["*"]; // Default to '*' for dev (secure in prod)

module.exports = async (req, res) => {
  // Handle CORS dynamically
  const origin = req.headers.origin;
  if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    return res.status(403).json({ error: "Not allowed by CORS" });
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { longUrl } = req.body;

  // Log for debugging (Vercel logs these)
  console.log("Received longUrl:", longUrl);

  // Validate input
  if (!longUrl || !longUrl.startsWith("https://wa.me/")) {
    console.error("Validation failed: Invalid or missing WhatsApp URL");
    return res.status(400).json({ error: "Invalid or missing WhatsApp URL" });
  }

  try {
    const encodedUrl = encodeURIComponent(longUrl);
    const tinyUrlApi = `https://tinyurl.com/api-create.php?url=${encodedUrl}`;

    console.log("Calling TinyURL API:", tinyUrlApi);

    const response = await fetch(tinyUrlApi);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("TinyURL API error:", response.status, errorText);
      throw new Error(
        `TinyURL API request failed: ${response.status} ${errorText}`
      );
    }

    const shortUrl = await response.text();
    console.log("TinyURL response:", shortUrl);

    if (!shortUrl.startsWith("https://tinyurl.com/")) {
      console.error("Invalid TinyURL response:", shortUrl);
      throw new Error("Invalid TinyURL response");
    }

    res.json({ shortUrl });
  } catch (error) {
    console.error("Error shortening URL:", error.message);
    res.status(500).json({ error: `Failed to shorten URL: ${error.message}` });
  }
};
