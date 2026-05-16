import { get, list } from "@vercel/blob";

export default async function handler(request, response) {
  const authHeader = request.headers.authorization;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword || authHeader !== `Bearer ${expectedPassword}`) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { blobs } = await list({ prefix: "clicks/" });
    const records = await Promise.all(
      blobs.map(async (blob) => {
        const result = await get(blob.pathname, { access: "private" });

        if (!result || result.statusCode !== 200) {
          return null;
        }

        const text = await new Response(result.stream).text();
        return JSON.parse(text);
      }),
    );

    const validRecords = records.filter(Boolean);
    validRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return response.status(200).json(validRecords);
  } catch (error) {
    return response.status(500).json({ error: "Could not load logs" });
  }
}
