# Quietly

Quietly is a mobile-first AI sound masking prototype for focus scenes such as offices, libraries, study rooms, shared workspaces, and dorm rooms.

It analyzes ambient sound locally in the browser, roughly identifies the dominant noise type, recommends a matching masking scene, and plays a soothing soundscape to reduce perceived distraction.

## Demo Focus

- Local microphone analysis with Web Audio API
- Coarse noise classification: quiet, speech, typing, fan, traffic, sudden, unknown
- Automatic scene recommendation with anti-flicker switching logic
- Five masking scenes with illustrations, motion overlays, and audio
- Mobile mini-program style UI, suitable for later WeChat mini program migration
- Privacy-first copy: local analysis only, no recording, no upload

## Scenes

| Scene | File | Use case |
|---|---|---|
| Rain Focus | `rain-focus.mp3` | Speech, keyboard, page turning |
| Cafe Murmur | `cafe-murmur.mp3` | Soft background masking for conversations |
| Ocean Low | `ocean-low.mp3` | Traffic, air conditioner, low-frequency hum |
| Forest Breeze | `forest-breeze.mp3` | Quiet environments and gentle focus |
| Deep Focus | `deep-focus.mp3` | Long study or writing sessions |

## Tech Stack

- React
- TypeScript
- Vite
- Web Audio API
- CSS Modules

## Local Setup

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

For microphone testing, use Chrome or Edge. Some embedded preview browsers cannot request system microphone permission.

## Build

```bash
npm run build
```

Production files are generated in:

```text
dist/
```

Preview the production build:

```bash
npm run preview
```

## Privacy Note

Quietly only analyzes audio features locally in the browser, such as volume, frequency distribution, and fluctuation. The prototype does not record, store, or upload audio.

## Current Limitations

- The noise classifier is rule-based, not a trained deep learning model.
- Detection is coarse and optimized for demo scenarios.
- Browser microphone permission requires a secure context and supported browser.
- A future WeChat mini program version should replace browser APIs with WeChat recording and audio APIs.

## Competition Materials

Recommended competition submission package:

- Online demo URL
- GitHub repository URL
- Product description document
- Short demo video
- Screenshots
- Source code package

See:

- `Quietly-Product-Brief.md`
- `Competition-Submission-Guide.md`
