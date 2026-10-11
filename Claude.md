# NotebookLM-Klon

## Ziel
Web-App, in der man Notebooks anlegt, Quellen (PDF/Text) hochlädt und per Chat Fragen dazu stellt. Antworten enthalten Zitate [1], [2], die auf die Textstelle in der Quelle verweisen.

Das Projekt ist ein Testprojekt für eine Bewerbung. Der Code wird auf GitHub geprüft, ich muss jeden Teil im Video erklären können.

## Stack
- Next.js (App Router), TypeScript, Tailwind, shadcn/ui
- Supabase: Postgres mit pgvector, Storage für Uploads
- Vercel AI SDK für Streaming
- Embedding- und Chat-Modell: werden im PLAN.md festgelegt
- Deployment: Vercel

## Arbeitsweise (wichtig)
- Erst planen, dann bauen. Vor größeren Änderungen kurz das Vorgehen nennen.
- Eine Aufgabe pro Schritt, kleine Änderungen. Kein "baue alles auf einmal".
- Nach jedem Schritt: was geändert wurde und wie ich es teste.
- Nicht selbst committen. Schlage stattdessen eine Commit-Message vor, ich prüfe den Diff und committe.
- Erkläre Kernstellen kurz (Chunking, Embeddings, Suche, Zitate, Prompt), ich muss sie im Video erklären.
- Keine Secrets im Code. Keys nur in `.env.local`, `.env.example` aktuell halten.
- Kein toter Code, keine Debug-Reste, keine unnötigen Abhängigkeiten.

## Architektur
**Ingestion:** Upload -> Text extrahieren -> Chunking (ca. 500-1000 Tokens, mit Überlappung) -> Embeddings -> Speichern in `chunks` (pgvector).

**Chat:** Frage einbetten -> Top-k ähnlichste Chunks, gefiltert auf die ausgewählten Quellen des Notebooks -> Prompt mit nummerierten Chunks -> Antwort streamen -> Zitate [n] in der UI mit Quelle und Textstelle verknüpfen.

## Datenmodell
- `notebooks`: Projekt, enthält mehrere Quellen
- `sources`: Datei/Text eines Notebooks, mit Status (verarbeitet/Fehler) und Auswahl an/aus
- `chunks`: Textstücke einer Quelle mit Embedding

## Regeln für Antworten des Modells
- Nur aus den gelieferten Quellen antworten.
- Steht nichts Passendes in den Quellen, das offen sagen und nichts erfinden.
- Jede Aussage mit Zitat [n] belegen.

## Umfang
**Enthalten:** Notebooks, Upload (PDF/Text), Chat mit Zitaten, Quellen an-/abwählen, Zusammenfassung pro Quelle, vorgeschlagene Fragen.

**Bewusst nicht enthalten:** Audio-Übersichten, Mindmaps, Teilen/Zusammenarbeit, sehr große Quellenmengen.

## Commits
Conventional Commits, auf Englisch, z. B. `feat: add pdf upload and chunking`, `fix: filter search by notebook`.

## Fertig bedeutet
- Läuft lokal und live auf Vercel
- README mit Start-Anleitung, Architektur und Abschnitt zur KI-Nutzung
- Keine Keys im Repo oder in der Historie