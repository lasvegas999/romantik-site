import { getStore } from "@netlify/blobs";

export default async (request) => {
  const authHeader = request.headers.get("authorization");
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword || authHeader !== `Bearer ${expectedPassword}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const store = getStore("button-clicks");
  const { blobs } = await store.list();

  const records = await Promise.all(
    blobs.map(async ({ key }) => {
      const record = await store.get(key, { type: "json", consistency: "strong" });
      return record;
    }),
  );

  records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return Response.json(records);
};
