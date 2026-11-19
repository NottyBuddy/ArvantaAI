# Arvanta · AI Help Desk

A fresh rebuild of the Arvanta AI Help Desk interface based on the supplied Base44 application reference.

## Current UI
- HRH Next + Arvanta branded header
- Home dashboard with the same hero layout and six content cards
- Ask Arvanta page with the supplied introduction, language list and suggested questions
- Library, Call Scripts, FAQs, Quick Reference, Brand & Product, and Team Directory sections
- **No Log a Call / call logging feature**

## Important migration status
This repository is being rebuilt from the original Base44 app reference. It is **not** a copy of the previous GitHub Help Desk implementation.

The current frontend is a UI foundation. Original Base44 private documents, database records, uploaded files, backend workflows and AI knowledge configuration have not been exported or imported. Content sections remain clearly marked as placeholders until the original source data becomes accessible.

## Run
Open `index.html` in a browser, or deploy the repository as a static site.

## Next build stages
1. Import the original Base44 Library documents and records when an export/source becomes available.
2. Build searchable document and FAQ data views.
3. Connect Ask Arvanta to an AI endpoint with approved-document retrieval (RAG).
4. Add the original app's remaining workflows and directory data after source inspection.
5. Validate the deployed experience against the Base44 reference.

Do not add secrets, API keys, customer personal data, or credentials to this repository.
