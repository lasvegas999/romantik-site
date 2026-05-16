import { put } from "@vercel/blob";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionId, visitorName, step, stage, choice } = request.body;

    if (
      !sessionId ||
      !visitorName ||
      !Number.isInteger(step) ||
      !["initial", "confirmation"].includes(stage) ||
      !["Evet", "Hayır"].includes(choice)
    ) {
      return response.status(400).json({ error: "Invalid choice" });
    }

    const createdAt = new Date().toISOString();
    const key = `clicks/${createdAt}-${crypto.randomUUID()}.json`;

    await put(
      key,
      JSON.stringify({
        sessionId,
        visitorName,
        step,
        stage,
        choice,
        createdAt,
      }),
      {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/json",
      },
    );

    return response.status(200).json({ ok: true });
  } catch (error) {
    return response.status(500).json({ error: "Could not save choice" });
  }
}
