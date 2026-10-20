# Build-Varianten mit µGulp™

Das Beispiel erzeugt Community und Professional aus derselben Quelldatei. gulp-mu-build-filter 2.0.6 entfernt die jeweils nicht ausgewählten Bereiche; die Eingabedatei bleibt unverändert.

## Start

Node.js ab 22; Dashboard: µGulp™ 1.1.0 und API 0.7.0. Die API ist als lokales Paketarchiv unter vendor/ beigefügt. Das Beispiel ist unabhängig vom übergeordneten Projekt installierbar.

```sh
npm ci --ignore-scripts
npm test
npm run check
npm run demo
```

Im Hauptprojekt öffnet START_EXAMPLE_BUILD_VARIANTS das eigene Dashboard. Stop beendet dessen Host. Alternativ dieses Verzeichnis als IDE-Projekt öffnen. microgulp.config.json liefert Projekttitel und das gebündelte Logo.

## Varianten und Quellmarkierungen

```json
{"schemaVersion":1,"variants":["Community","Professional"]}
```

Die Konfiguration wählt aus den beiden implementierten Varianten aus. Eine zusätzliche Variante benötigt auch Quellmarkierungen, Validierung und Tests. In µGulp™ erscheint eine Checkboxauswahl mit Abbrechen; die CLI erstellt alle konfigurierten Varianten.

```javascript
/*-- @<BUILD_ONLY_AT_CLIENTS:Professional --*/
  'professional-export',
/*-- @>BUILD_ONLY_AT_CLIENTS --*/
```

Der Filter erhält mode: 'remove', release: 'Production' und client/variants mit der gewählten Kennung. Jeder Lauf schreibt nach dist/build-<Zufallskennung>/. Die erzeugten Module werden mit node --check geprüft; erst danach entsteht manifest.json. Community enthält genau common und community-help, Professional genau common und professional-export. Fehlerhafte Ausgaben bleiben zur Diagnose ohne Erfolgsmanifest liegen. Vorhandene Ausgaben werden nicht gelöscht. Das Entfernen von Code ist keine Berechtigungsprüfung; vertrauliche Daten gehören nicht in die gemeinsame Vorlage.

## Version und Prüfungen

Recipe 1.1.0: RELEASES.json ist die einzige Versionsquelle; npm run release:check prüft Paket und Lockdatei. Sechs Tests prüfen Release-Vertrag sowie beide tatsächlichen Filterausgaben, unveränderte Quelle, getrennte Folgeläufe, ungültige Auswahl und Syntaxfehler. Windows/Node 22 wurde geprüft; eine manuelle IDE-Abnahme und weitere Plattformen stehen aus.

Die bestehenden deutschen/englischen UI-Wörterbücher bleiben erhalten. Weitere Artikel- und Promptübersetzungen erst am Ende. Prompts werden beim Artikel als .src.md mit Quellenhash gepflegt.

## Kurztasten im Dashboard

- `BUILD_VARIANTS`: Windows/Linux `Ctrl+Shift+F8`, macOS `Cmd+Shift+F8`.

Zuerst das µGulp-Dashboard fokussieren. Die Kurztaste startet denselben Task wie ein Klick, einschließlich eines vorhandenen Taskformulars; sie wählt keine Formularwerte vor und sendet das Formular nicht ab. In Texteingabefeldern werden keine Task-Kurztasten ausgelöst. Die Belegungen gelten im Dashboard, nicht IDE-weit. Falls IDE oder Betriebssystem eine Kombination abfangen, lässt sich `µKeyBinding` im Gulpfile ändern. Manche Tastaturen benötigen zusätzlich Fn für Funktionstasten.

```javascript
BUILD_VARIANTS.µKeyBinding = { key: 'ctrl+shift+F8', mac: 'cmd+shift+F8' };
```

<!-- blog-publication:start -->
Artikel: [Deutsch](https://microgulp.dev/blogs/gulp-mu-build-filter)

Weitere Beispiele: [microGulp-Examples](https://github.com/mamekudz/microGulp-Examples).
<!-- blog-publication:end -->
