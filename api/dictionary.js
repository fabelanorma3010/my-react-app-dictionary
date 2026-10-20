module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const word = typeof req.query.word === "string" ? req.query.word.trim() : "";
  if (!word) {
    return res.status(400).json({ error: "A word to look up is required." });
  }

  const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
    word,
  )}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch {
    return res.status(502).json({
      error: "Could not reach the Free Dictionary API.",
    });
  }
};
