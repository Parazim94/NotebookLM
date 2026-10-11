# PLAN

Jeder Schritt ist klein und einzeln testbar. Nach jedem Schritt: Änderungen ansehen, testen, Diff prüfen, selbst committen (Commit-Message-Vorschlag kommt von Claude).

## Modellwahl (Vorschlag, bitte bestätigen)
- **Embeddings:** OpenAI `text-embedding-3-small` (1536 Dimensionen), da Anthropic keine Embeddings anbietet. Günstig, gute Qualität, einfach über das Vercel AI SDK nutzbar.
- **Chat:** Claude Sonnet über das Vercel AI SDK (`@ai-sdk/anthropic`), Streaming.
- Konsequenz: Spalte `chunks.embedding` ist `vector(1536)`. Ein Modellwechsel später erfordert Neu-Einbettung aller Chunks.
- Benötigte Keys: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, Supabase-URL und -Keys.

## Phase 0: Fundament
1. **Projekt aufsetzen:** Next.js (App Router, TypeScript, Tailwind), shadcn/ui, `.gitignore`, `.env.example`, `git init`.
2. **Supabase-Projekt anlegen:** pgvector aktivieren, Storage-Bucket `uploads`, Keys in `.env.local`.
3. **Datenmodell:** SQL-Migration für `notebooks`, `sources` (Status, selected), `chunks` (embedding `vector(1536)`, HNSW-Index). Supabase-Client im Code.

## Phase 1: Notebooks und Quellen
4. **Notebooks:** Liste, anlegen, umbenennen, löschen (UI + Server Actions).
5. **Upload:** Datei (PDF/Text) und eingefügten Text hochladen, in Storage speichern, `sources`-Eintrag mit Status `pending`.
6. **Textextraktion:** PDF und Text auslesen, dabei Seitenzahlen für spätere Zitate behalten.

## Phase 2: Ingestion
7. **Chunking:** ca. 500 bis 1000 Tokens, mit Überlappung, Position/Seite pro Chunk speichern. (Kernstelle fürs Video)
8. **Embeddings:** Chunks einbetten (batchweise), in `chunks` speichern, Status `processed` oder `error`. (Kernstelle)
9. **Quellenliste in der UI:** Status anzeigen, Quellen an/aus schalten, löschen.

## Phase 3: Chat mit Zitaten
10. **Suche:** SQL-Funktion für Top-k-Ähnlichkeit, gefiltert auf Notebook und ausgewählte Quellen. (Kernstelle)
11. **Chat-API mit Streaming:** Frage einbetten, Chunks holen, Prompt mit nummerierten Chunks und den Regeln aus Claude.md, Antwort streamen. (Kernstelle)
12. **Chat-UI:** Nachrichtenverlauf, Eingabe, Streaming-Anzeige.
13. **Zitate:** [n] in der Antwort erkennen und mit Quelle und Textstelle verknüpfen (Hover/Klick zeigt den Chunk). (Kernstelle)

## Phase 4: Zusatzfunktionen
14. **Zusammenfassung pro Quelle** (beim Verarbeiten oder auf Knopfdruck).
15. **Vorgeschlagene Fragen** pro Notebook.

## Phase 5: Abschluss
16. **Fehlerbehandlung und Politur:** Ladezustände, leere Zustände, Limits für Dateigröße.
17. **Deployment auf Vercel:** Umgebungsvariablen, Live-Test.
18. **README:** Start-Anleitung, Architektur, Abschnitt zur KI-Nutzung. Abschlusscheck: keine Keys im Repo oder in der Historie, kein toter Code.
