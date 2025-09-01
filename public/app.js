function generateWALink() {
  const phoneNumber = document.getElementById("phone").value;
  const message = document.getElementById("message").value;

  let walink = `https://wa.me/${phoneNumber}`;
  if (message) {
    walink += `?text=${encodeURIComponent(message)}`;
  }

  document.getElementById("walink").value = walink;
  document.getElementById("output").style.display = "block";
}

const generate = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");
const shortenBtn = document.getElementById("shorten-url");
const copySuccess = document.getElementById("copy-success");

generate.addEventListener("click", generateWALink);

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(
      document.getElementById("walink").value
    );
    copySuccess.style.display = "block"; // Show success
  } catch (err) {
    alert("Copy failed: " + err.message);
  }
});

shortenBtn.addEventListener("click", async () => {
  const longUrl = document.getElementById("walink").value;

  if (!longUrl) {
    alert("No WhatsApp link to shorten. Please generate a link first.");
    return;
  }

  try {
    const response = await fetch("/shorten-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to shorten URL");
    }

    // Update the input with the short URL
    document.getElementById("walink").value = data.shortUrl;
  } catch (error) {
    alert("Error shortening URL: " + error.message);
  }
});
