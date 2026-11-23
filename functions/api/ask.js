const MAX_QUESTION = 1200;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export async function onRequestPost({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json", message: "Question format invalid hai." }, 400);
  }

  const question = String(body?.question || "").trim();
  if (!question) {
    return json({ error: "empty_question", message: "Pehle apna question type karein." }, 400);
  }
  if (question.length > MAX_QUESTION) {
    return json({ error: "question_too_long", message: "Question 1,200 characters se chhota rakhein." }, 400);
  }

  // Legacy knowledge reset: do not read Cloudflare KV or answer from old embedded data.
  // Re-enable the assistant only after the new approved DOCX sources are reviewed and imported.
  return json({
    error: "knowledge_reset",
    message: "Purana knowledge base reset ho raha hai. Naye approved documents upload aur verify hone ke baad Arvanta dobara answers dega.",
    sources: []
  }, 200);
}
