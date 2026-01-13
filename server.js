// Darcula-Dark/server.js

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cors());

// Directory that holds theme files (darcula_dark.json and index.html)
const themesDir = path.join(__dirname, "themes");

// Serve static files from the themes directory
app.use(express.static(themesDir));

// Root route serves index.html explicitly
app.get("/", (req, res) => {
  res.sendFile(path.join(themesDir, "index.html"));
});

// POST /save – accepts a theme object and writes it to darcula_dark.json
app.post("/save", (req, res) => {
  const data = req.body; // Expected structure: { themes: [ ... ] }
  const filePath = path.join(themesDir, "darcula_dark.json");

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).json({ error: "Failed to write file" });
    }
    console.log(`Theme saved to ${filePath}`);
    res.json({ message: "Saved!" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
