# PLAN

## Stand (zuletzt: Schritt 7 fertig, nächster Schritt: 8)
Erledigt: Schritte 1 bis 7. Beim Weitermachen zuerst diesen Abschnitt lesen, dann mit Schritt 8 beginnen.

**Entschieden und gebaut**
- Modelle: OpenAI `text-embedding-3-small` (1536 Dimensionen), Chat mit Claude Sonnet über das Vercel AI SDK.
- Kein Login. Zugriff nur serverseitig mit dem Supabase-Secret-Key (RLS an, keine Policies). Das kommt als bekannte Einschränkung ins README.
- Next.js 16 mit `cacheComponents`: Seiten mit Datenzugriff brauchen `<Suspense>`, `params` ist ein Promise. Vor neuen Next-Features in `node_modules/next/dist/docs/` nachlesen (siehe `AGENTS.md`).
- Datenbank: `supabase/migrations/0001_init.sql` ist in Supabase ausgeführt (`notebooks`, `sources`, `chunks`). Storage-Bucket `uploads` ist privat.
- Upload: Dateien (PDF/TXT/MD, max. 4 MB wegen des Vercel-Limits von 4,5 MB) und eingefügter Text landen als `<notebook-id>/<uuid>.<ext>` im Bucket, `sources.status` startet mit `pending`. Eingefügter Text wird als `.txt` gespeichert.
- `src/lib/extract.ts`: `extractPages(data, type)` liefert `{ page, text }` pro PDF-Seite (`unpdf`), bei Text `page: null`. Eine defekte PDF wirft einen Fehler.
- `src/lib/chunk.ts`: `chunkPages(pages)` liefert `{ chunk_index, page, content }`. 3000 Zeichen (ca. 750 Tokens), 400 Zeichen Überlappung, Schnitt an Absatz, Zeilenumbruch, Satzende oder Leerzeichen, pro Seite getrennt.
- Aufgeräumt: shadcn hatte das Paket `cn` eingebunden, ersetzt durch `clsx` und `tailwind-merge` in `src/lib/utils.ts`.

**Bekannte Grenzen (fürs README)**
- Gescannte PDFs ohne Text werden nicht unterstützt (kein OCR).
- Die Chunk-Größe ist über Zeichen geschätzt, nicht über Tokens.
- Ohne Login sind alle Notebooks für jeden sichtbar, der die App erreicht.

**Offen vor Schritt 8**
- `OPENAI_API_KEY` und `ANTHROPIC_API_KEY` in `.env.local` eintragen (aktuell leer).
- Der Code der Schritte 4 bis 7 ist noch nicht committet, falls nicht schon geschehen. Commit-Vorschläge: `feat: add notebook list with create, rename and delete`, `feat: add notebook page with source upload`, `feat: extract text per page from pdf and text sources`, `feat: split extracted pages into overlapping chunks`.

**Arbeitsweise:** siehe `CLAUDE.md`. Kurz: ein Schritt nach dem anderen, vorher das Vorgehen nennen, nicht selbst committen, Kernstellen erklären.

Jeder Schritt ist klein und einzeln testbar. Nach jedem Schritt: Änderungen ansehen, testen, Diff prüfen, selbst committen (Commit-Message-Vorschlag kommt von Claude).

## Modellwahl (Vorschlag, bitte bestätigen)
- **Embeddings:** OpenAI `text-embedding-3-small` (1536 Dimensionen), da Anthropic keine Embeddings anbietet. Günstig, gute Qualität, einfach über das Vercel AI SDK nutzbar.
- **Chat:** Claude Sonnet über das Vercel AI SDK (`@ai-sdk/anthropic`), Streaming.
- Konsequenz: Spalte `chunks.embedding` ist `vector(1536)`. Ein Modellwechsel später erfordert Neu-Einbettung aller Chunks.
- Benötigte Keys: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, Supabase-URL und -Keys.

## Phase 0: Fundament
1. ✅ **Projekt aufsetzen:** Next.js (App Router, TypeScript, Tailwind), shadcn/ui, `.gitignore`, `.env.example`, `git init`.
2. ✅ **Supabase-Projekt anlegen:** pgvector aktivieren, Storage-Bucket `uploads`, Keys in `.env.local`.
3. ✅ **Datenmodell:** SQL-Migration für `notebooks`, `sources` (Status, selected), `chunks` (embedding `vector(1536)`, HNSW-Index). Supabase-Client im Code.

## Phase 1: Notebooks und Quellen
4. ✅ **Notebooks:** Liste, anlegen, umbenennen, löschen (UI + Server Actions).
5. ✅ **Upload:** Datei (PDF/Text) und eingefügten Text hochladen, in Storage speichern, `sources`-Eintrag mit Status `pending`.
6. ✅ **Textextraktion:** PDF und Text auslesen, dabei Seitenzahlen für spätere Zitate behalten.

## Phase 2: Ingestion
7. ✅ **Chunking:** ca. 500 bis 1000 Tokens, mit Überlappung, Position/Seite pro Chunk speichern. (Kernstelle fürs Video)
8. **Embeddings:** Chunks einbetten (batchweise), in `chunks` speichern, Status `processed` oder `error`. (Kernstelle)
9. **Quellenliste in der UI:** Status anzeigen, Quellen an/aus schalten, löschen.

## Phase 3: Chat mit Zitaten
10. **Suche:** SQL-Funktion für Top-k-Ähnlichkeit, gefiltert auf Notebook und ausgewählte Quellen. (Kernstelle)
11. **Chat-API mit Streaming:** Frage einbetten, Chunks holen, Prompt mit nummerierten Chunks und den Regeln aus CLAUDE.md, Antwort streamen. (Kernstelle)
12. **Chat-UI:** Nachrichtenverlauf, Eingabe, Streaming-Anzeige.
13. **Zitate:** [n] in der Antwort erkennen und mit Quelle und Textstelle verknüpfen (Hover/Klick zeigt den Chunk). (Kernstelle)

## Phase 4: Zusatzfunktionen
14. **Zusammenfassung pro Quelle** (beim Verarbeiten oder auf Knopfdruck).
15. **Vorgeschlagene Fragen** pro Notebook.

## Phase 5: Abschluss
16. **Fehlerbehandlung und Politur:** Ladezustände, leere Zustände, Limits für Dateigröße.
17. **Deployment auf Vercel:** Umgebungsvariablen, Live-Test.
18. **README:** Start-Anleitung, Architektur, Abschnitt zur KI-Nutzung. Abschlusscheck: keine Keys im Repo oder in der Historie, kein toter Code.
