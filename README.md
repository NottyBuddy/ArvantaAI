# Arvanta · AI Help Desk

A fresh rebuild of the Arvanta AI Help Desk based on the Base44 interface reference supplied in this project.

## Included
- HRH Next + Arvanta branded header and navigation
- Home dashboard with six destination cards
- Ask Arvanta chat UI with the supplied greeting and suggested questions
- Library, Call Scripts, FAQs, Quick Reference, Brand & Product, and Team Directory sections
- **No Log a Call / call logging feature**
- Cloudflare Pages Function at `functions/api/ask.js` for approved-source retrieval and Workers AI answer generation

## Migration status
This repository is **not** a copy of the previous GitHub Help Desk. The frontend was reconstructed from the screenshot and text provided.

Original Base44 private documents, database records, uploaded files, workflows and AI knowledge configuration have not been exported or imported. The Library, FAQ, product and team sections are currently placeholders. Arvanta's API only answers from approved documents stored in the configured knowledge store; it refuses to guess when no matching source exists.

## Hosting
Deploy on **Cloudflare Pages** with this repository connected, no build command, and repository root as the build output directory. Cloudflare Pages is required for the `functions/api/ask.js` endpoint. GitHub Pages can host only the static frontend and will not execute that API function.

See [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) for Workers AI and KV binding setup, the approved-document format, and verification steps.

## Safety
Never commit API keys, passwords, customer personal data, or other secrets. Only upload exact approved company documents to the knowledge store.
