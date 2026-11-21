# Visual Email Builder

A professional email composition platform with a drag-and-drop interface, real-time preview, and import/export capabilities.

[![Node.js](https://img.shields.io/badge/Node.js->=14.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Description

Visual Email Builder lets you create HTML emails without coding. Start with professional templates, edit components with a live property panel, and export clean, compatible HTML for any email client. Includes optional SMTP integration for direct sending.

## Features

### Visual Editor

- 8+ component types: text, headings, images, buttons, dividers, spacers, columns, social links
- Drag-and-drop reordering with mouse and touch support
- Live property panel for real-time editing of colors, sizes, and alignment
- Undo/redo system (50-step history) with keyboard shortcuts
- Dark mode

### Import/Export

**Import from HTML**
- 30+ element types recognized automatically
- Bootstrap, Tailwind CSS, and email template support
- Smart detection of buttons, images, text, and layouts
- Style extraction (colors, fonts, spacing)
- Upload file or paste HTML

**Export**
- Clean, production-ready HTML
- Drafts saved to LocalStorage
- Copy/paste for quick sharing

### Templates

- Welcome emails
- Newsletters
- Promotional emails
- Transactional emails (receipts, confirmations)
- Blank canvas

## Requirements

- Node.js >= 14
- npm >= 6

## Installation

Standalone (no server, works offline):

```bash
git clone https://github.com/NGeff/visual-email-builder.git
cd visual-email-builder
open public/index.html
```

With SMTP server:

```bash
git clone https://github.com/NGeff/visual-email-builder.git
cd visual-email-builder
npm install
cp .env.example .env
npm start
```

Edit `.env`:

```env
PORT=3000
NODE_ENV=development

SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=YOUR_SMTP_USER
SMTP_PASS=YOUR_SMTP_PASSWORD

SENDER_EMAIL=your_email@example.com
SENDER_NAME=Your Name

ALLOWED_ORIGINS=http://localhost:3000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

The editor runs at `http://localhost:3000`.

## Usage

1. Select a template or start from a blank canvas.
2. Drag components from the sidebar into the editor.
3. Select a component to edit its properties in the live panel.
4. Use Undo/redo (`Ctrl/Cmd + Z`, `Ctrl/Cmd + Y`) as needed.
5. Export HTML or save a draft.

## Project Structure

```
visual-email-builder/
├── .env.example
├── package.json
├── public/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── editor.js
│       ├── components.js
│       ├── templates.js
│       └── utils.js
├── server/
│   └── server.js
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
└── README.md
```

## Security

- XSS prevention through HTML sanitization
- CSRF protection with secure headers
- Rate limiting on API endpoints
- Input validation for email and data
- CORS configuration for controlled access

Store SMTP credentials in environment variables and rotate them regularly.

## License

MIT © NGeff
