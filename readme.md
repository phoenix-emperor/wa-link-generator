# WA-Link Generator

A simple web app to generate and optionally shorten WhatsApp links with preset messages. Includes PWA support and QR code integration.

## Features

- Generate WhatsApp links with phone number and optional message
- Shorten generated links using TinyURL
- Copy generated/shortened links to clipboard
- PWA: Offline support via service worker
- Quick access to QR code generator
- Responsive, mobile-friendly UI

## Project Structure

```
.
├── app.js                # Main frontend JS logic
├── index.html            # Main HTML file
├── styles.css            # App styles
├── server.js             # Express server for local development (TinyURL proxy)
├── package.json          # Node dependencies
├── vercel.json           # Vercel config for API routing
├── api/
│   └── shorten-url.js    # Serverless function for URL shortening (Vercel)
├── public/
│   ├── sw.js             # Service worker for PWA
│   ├── manifest.json     # PWA manifest
│   ├── favicon.ico       # Favicon
│   ├── apple-touch-icon.ico
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
```

## Usage

### 1. Local Development

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Start the Express server:**
   ```sh
   node server.js
   ```
   The server runs at [http://localhost:3000](http://localhost:3000).

3. **Open `index.html` in your browser** (e.g., using Live Server or by double-clicking).

### 2. Production/Deployment

- Deploy to [Vercel](https://vercel.com/) for serverless API support.
- The `/api/shorten-url` endpoint is handled by [`api/shorten-url.js`](api/shorten-url.js).

### 3. WhatsApp Link Generation

- Enter a phone number (in international format, e.g., `2348123456789`).
- Optionally, enter a preset message.
- Click **Generate** to create the WhatsApp link.
- Click **Shorten URL** to get a TinyURL version.
- Use **Copy** to copy the link.
- Use the **QR Code Generator** button to open an external QR code generator.

## PWA Support

- The app registers a service worker ([`public/sw.js`](public/sw.js)) for offline support.
- PWA manifest is at [`public/manifest.json`](public/manifest.json).

## API Endpoints

- **POST `/shorten-url`** (local) or **POST `/api/shorten-url`** (Vercel):
  - Request body: `{ "longUrl": "https://wa.me/..." }`
  - Response: `{ "shortUrl": "https://tinyurl.com/..." }`

## Environment Variables

- For Vercel, you can set `ALLOWED_ORIGINS` (comma-separated) to control CORS in [`api/shorten-url.js`](api/shorten-url.js).

## License

ISC

---

**Author:**  
[Your Name]