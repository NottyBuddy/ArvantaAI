# Arvanta AI — Cloudflare Pages setup

The Ask Arvanta endpoint is `functions/api/ask.js`. It runs as a Cloudflare Pages Function and deliberately refuses to invent policy answers when no approved source matches.

## 1. Connect this repository to Cloudflare Pages
- Create/open a Cloudflare Pages project and connect `NottyBuddy/ArvantaAI`.
- Production branch: `main`.
- Framework preset: None.
- Build command: leave blank.
- Build output directory: `/` (repository root).
- Deploy. Cloudflare Pages detects the `functions/` directory automatically.

GitHub Pages can host the static HTML, but it does not execute Cloudflare Pages Functions. The Ask Arvanta API needs Cloudflare Pages.

## 2. Add the Workers AI binding
In Cloudflare Dashboard → Workers & Pages → your Pages project → Settings → Functions → Workers AI:
- Add binding name: `AI`.
- Save and redeploy.

The function uses model `@cf/meta/llama-3.1-8b-instruct-fast`.

## 3. Add the approved-document store
- Create a Cloudflare KV namespace, for example `arvanta-approved-knowledge`.
- In the Pages project → Settings → Functions → KV namespace bindings, add:
  - Variable name: `KNOWLEDGE`
  - KV namespace: `arvanta-approved-knowledge`
- Add a KV key named `approved_docs` with JSON value as an array. Each entry must look like:

```json
[
  {
    "status": "approved",
    "title": "Document title",
    "section": "Section or page heading",
    "content": "Exact approved text extracted from the source document.",
    "tags": ["pricing", "warranty"],
    "url": "/library"
  }
]
```

Only records with `status: "approved"` are considered. Keep each entry to one useful section/chunk. Do not place customer personal data, passwords, or secrets in this store.

## 4. Verify
After adding both bindings and redeploying, open the app and ask a question supported by an imported approved document. If no matching approved source exists, Arvanta will say so rather than guessing.

## Current limitation
The original Base44 private Library, FAQ records, product catalogue and team directory have not been exported. Do not populate this store with guessed policies. Import exact approved content before enabling production answers.
