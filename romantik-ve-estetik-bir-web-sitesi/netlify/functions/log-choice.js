import { getStore } from "@netlify/blobs";

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { choice } = await request.json();

    if (!["Evet", "Evet ❤️", "Hayır"].includes(choice)) {
      return new Response("Invalid choice", { status: 400 });
    }

    const store = getStore("button-clicks");
    const createdAt = new Date().toISOString();
    const key = `${createdAt}-${crypto.randomUUID()}`;

    await store.setJSON(key, { choice, createdAt });

    return Response.json({ ok: true });
  } catch (error) {
    return new Response("Could not save choice", { status: 500 });
  }
};
