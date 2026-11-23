import approvedDocs from "../approved-knowledge.js";

export async function onRequestGet() {
  const docs = approvedDocs
    .filter(doc => doc?.status === "approved")
    .map(({ title, section, tags, content }) => ({ title, section, tags, content }));
  return new Response(JSON.stringify({ docs }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
