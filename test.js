async function generateWALink() {
  const phoneNumber = document.getElementById("phone").value;
  const message = document.getElementById("message").value;
  const wantQR = document.getElementById("want-qr").checked;
  const wantShort = document.getElementById("want-short").checked;

  try {
    const res = await fetch("http://localhost:5000/generate-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phoneNumber,
        message,
        shorten: wantShort,
      }),
    });

    const data = await res.json();
    const walink = data.link;

    document.getElementById("walink").value = walink;
    document.getElementById("output").style.display = "block";

    if (wantQR) {
      generateQRCode(walink);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
