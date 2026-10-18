module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.SHECODES_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "Photo search is not configured." });
  }

  const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
  if (!query) {
    return res.status(400).json({ error: "A search query is required." });
  }

  const apiUrl = new URL("https://api.shecodes.io/images/v1/search");
  apiUrl.searchParams.set("query", query);
  apiUrl.searchParams.set("key", apiKey);

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: "The SheCodes photo service rejected the request.",
      });
    }

    return res.status(200).json({ photos: data.photos || [] });
  } catch {
    return res.status(502).json({ error: "Could not reach the photo service." });
  }
};
