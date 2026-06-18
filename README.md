# Smart Audio Transcription 🚀

> **Convert your audio files to text with accuracy**

A professional Full-Stack application designed to streamline the process of converting lectures, meetings, and voice notes into fully formatted documents. The project features an automated audio compression pipeline coupled with Google's advanced Gemini 2.5 Flash model for lightning-fast and highly accurate text transcription.

## ✨ Core Features

- **Multi-Format Ingestion:** Accepts both Audio (`.mp3`, `.wav`, `.aac`) and Video (`.mp4`, `.mov`) files.
- **Advanced Audio Engineering:** Integrates a dedicated local script (`compressor.py`) powered by `FFmpeg` to compress heavy media files into a lightweight mono format, eliminating `503 Unavailable` timeouts.
- **AI Transcription Core:** Powered by `Gemini 2.5 Flash` to handle multilingual outputs (Arabic & English) with high contextual precision.
- **Automated Document Exporting:** Structures the raw parsed text beautifully and exports it immediately into clean Microsoft Word (`.docx`) files or high-quality PDFs via `Spire.Doc`.
- **Modern User Experience:** Reactive React-based dashboard supporting clean interactive drag-and-drop actions.

## 📂 Project Structure

To keep the project clean and professional for GitHub, files are separated into isolated layers:

```text
EPSF/
├── backend/               # FastAPI Server Application
│   ├── main.py            # API Routes and Uvicorn Configuration
│   ├── processor.py       # Gemini API Core Logic & Document Formatting
│   ├── compressor.py      # Audio Compression Logic (FFmpeg pipeline)
│   └── requirements.txt   # Backend Dependencies
├── frontend/              # React User Interface (epsf-frontend)
│   ├── src/               # Component Views and App.js Logic
│   ├── public/            # Static Application Assets
│   └── package.json       # Frontend Node Packages
└── README.md              # Project Blueprint & Overview
```
