const express = require("express");
const cors = require("cors");
// Use node-fetch v2 CommonJS or v3 CommonJS fallback
const fetch = require("node-fetch").default || require("node-fetch");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Allow both origins
  })
);

// Route to shorten URL using TinyURL API
app.post("/shorten-url", async (req, res) => {
  const { longUrl } = req.body;

  // Log incoming request for debugging
  console.log("Received longUrl:", longUrl);

  // Validate input
  if (!longUrl || !longUrl.startsWith("https://wa.me/")) {
    console.error("Validation failed: Invalid or missing WhatsApp URL");
    return res.status(400).json({ error: "Invalid or missing WhatsApp URL" });
  }

  try {
    // Encode the long URL for safe API request
    const encodedUrl = encodeURIComponent(longUrl);
    const tinyUrlApi = `.https://tinyurl.com/api-create.php?url=${encodedUrl}`;

    // Log the API URL for debugging
    console.log("Calling TinyURL API:", tinyUrlApi);

    // Make request to TinyURL API
    const response = await fetch(tinyUrlApi);

    // Check response status
    if (!response.ok) {
      const errorText = await response.text();
      console.error("TinyURL API error:", response.status, errorText);
      throw new Error(
        `TinyURL API request failed: ${response.status} ${errorText}`
      );
    }

    // Get the short URL (plain text response)
    const shortUrl = await response.text();

    // Log the response for debugging
    console.log("TinyURL response:", shortUrl);

    // Check if response is a valid URL
    if (!shortUrl.startsWith("https://tinyurl.com/")) {
      console.error("Invalid TinyURL response:", shortUrl);
      throw new Error("Invalid TinyURL response");
    }

    res.json({ shortUrl });
  } catch (error) {
    console.error("Error shortening URL:", error.message);
    res.status(500).json({ error: `Failed to shorten URL: ${error.message}` });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
