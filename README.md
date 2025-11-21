<p align="center">
  <img src="public/logo.svg" alt="Email Logo" width="120" height="120">
</p> 


# 📧 Visual Email Builder

### **Professional Email Composition Platform with Real-Time Preview**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/ngeff/visual-email-builder?style=social)](https://github.com/ngeff/visual-email-builder)

**Create stunning HTML emails with a drag-and-drop interface, professional templates, and powerful import/export capabilities.**

[Demo](#-demo) • [Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🎯 **Why Visual Email Builder?**

Building professional HTML emails is **hard**. Tables, inline styles, email client compatibility - it's a nightmare. Visual Email Builder makes it **simple**.

✨ **Drag & Drop** - No coding required  
🎨 **Professional Templates** - Start with proven designs  
📱 **Responsive Preview** - See desktop and mobile views  
⚡ **Smart Import** - Load any HTML email and edit it  
🚀 **Export Anywhere** - Download clean, compatible HTML  
📧 **Direct Sending** - SMTP integration built-in  

---

## ✨ **Features**

### 🎨 **Visual Editor**
- **8+ Component Types** - Text, Headings, Images, Buttons, Dividers, Spacers, Columns, Social Links
- **Drag & Drop Reordering** - Touch and mouse support
- **Live Property Panel** - Edit colors, sizes, alignment in real-time
- **Undo/Redo System** - 50-step history with keyboard shortcuts
- **Dark Mode** - Comfortable editing in any lighting

### 📥 **Powerful Import/Export**

#### **Import from HTML** ⚡ *NEW & IMPROVED*
- ✅ **30+ Element Types** recognized automatically
- ✅ **Framework Support** - Bootstrap, Tailwind CSS, email templates
- ✅ **Smart Detection** - Buttons, images, text, layouts
- ✅ **Style Extraction** - Colors, fonts, spacing preserved
- ✅ **Two Methods** - Upload file or paste HTML

#### **Export Options**
- 📄 **Clean HTML** - Production-ready email code
- 💾 **Save Drafts** - LocalStorage persistence
- 📋 **Copy/Paste** - Quick sharing

### 🎭 **Professional Templates**
- **Welcome Emails** - Onboard new users
- **Newsletters** - Share updates and news
- **Promotional** - Announce sales and offers
- **Transactional** - Receipts and confirmations
- **Blank Canvas** - Start from scratch

### 🛠️ **Developer Experience**
- **Modular Architecture** - Clean, maintainable code
- **No Dependencies** - Pure JavaScript, works offline
- **Security First** - XSS protection, input sanitization
- **Rate Limiting** - Production-ready API
- **Comprehensive Docs** - Every feature explained

---

## 🚀 **Quick Start**

### **Option 1: Standalone (No Server)**

Perfect for local use or static hosting.

```bash
# Clone the repository
git clone https://github.com/ngeff/visual-email-builder.git
cd visual-email-builder

# Open in browser
open public/index.html
# Or simply double-click index.html
```

**That's it!** The editor works completely offline.

### **Option 2: With Server (For Email Sending)**

Includes SMTP integration for direct sending.

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your SMTP credentials

# Start server
npm start
```

Open `http://localhost:3000`

---

## 📖 **Documentation**

### **Basic Usage**

1. **Add Components** - Click buttons in the left sidebar
2. **Customize** - Select any block to edit properties
3. **Reorder** - Drag and drop blocks to rearrange
4. **Preview** - See real-time updates on the right
5. **Export or Send** - Download HTML or send directly

### **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` | Redo |
| `Ctrl/Cmd + S` | Save Draft |
| `Ctrl/Cmd + E` | Export HTML |
| `Delete` | Remove Selected Block |

### **Import HTML**

The import feature recognizes:

**Elements:** `<p>`, `<h1-h6>`, `<img>`, `<a>`, `<button>`, `<div>`, `<span>`, `<table>`, `<ul>`, `<ol>`, `<hr>`, `<blockquote>`, `<strong>`, `<em>`, and more

**Frameworks:** Bootstrap classes (`.btn`, `.btn-primary`), Tailwind utilities (`.bg-blue`, `.rounded`)

**Styles:** Inline styles, computed styles, colors (RGB/HEX), fonts, spacing, borders

**Structures:** Email tables, multi-column layouts, social media links

### **SMTP Configuration**

Supports any SMTP provider:

```env
# Brevo (Sendinblue)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587

# Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
```

---

## 🏗️ **Project Structure**

```
visual-email-builder/
├── public/
│   ├── css/
│   │   └── styles.css           # Complete design system
│   ├── js/
│   │   ├── editor.js            # Main editor logic
│   │   ├── components.js        # Block components
│   │   ├── templates.js         # Template library
│   │   └── utils.js             # Utility functions
│   └── index.html               # Main interface
├── server/
│   ├── config/
│   │   └── email.config.js      # SMTP configuration
│   ├── controllers/
│   │   └── email.controller.js  # Email logic
│   ├── routes/
│   │   └── email.routes.js      # API routes
│   ├── utils/
│   │   └── validators.js        # Input validation
│   └── server.js                # Express server
├── .env.example                 # Environment template
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── package.json
├── README.md
├── SECURITY.md
└── TESTING.md
```

---

## 🎨 **Components**

### Available Blocks

| Component | Description | Properties |
|-----------|-------------|------------|
| **Text** | Paragraphs and body text | Font size, color, alignment, weight |
| **Heading** | H1-H6 headers | Level, size, color, alignment |
| **Image** | Pictures and graphics | URL, alt text, width, alignment, link |
| **Button** | Call-to-action buttons | Text, URL, colors, radius, alignment |
| **Divider** | Horizontal lines | Color, thickness, width, style |
| **Spacer** | Vertical spacing | Height |
| **Columns** | Multi-column layout | Gap, content for each column |
| **Social** | Social media icons | Platforms, icon size, spacing |

---

## 🔒 **Security**

### Built-in Protection
- ✅ **XSS Prevention** - HTML sanitization
- ✅ **CSRF Protection** - Secure headers
- ✅ **Rate Limiting** - API throttling
- ✅ **Input Validation** - Email and data validation
- ✅ **CORS Configuration** - Controlled access

### Best Practices
- Store SMTP credentials in environment variables
- Use app-specific passwords for email services
- Enable 2FA on email accounts
- Rotate credentials regularly
- Monitor for unusual activity

See [SECURITY.md](SECURITY.md) for details.

---

## 🤝 **Contributing**

We love contributions! Here's how you can help:

### Quick Contribution

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Make your changes
4. Commit with clear messages
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. Push to your fork
   ```bash
   git push origin feature/amazing-feature
   ```
6. Open a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/ngeff/visual-email-builder.git

# Install dependencies
npm install

# Start development server
npm run dev
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📊 **Browser Support**

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| iOS Safari | 14+ | ✅ Fully Supported |
| Chrome Mobile | 90+ | ✅ Fully Supported |

---

## 📜 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means

✅ Commercial use  
✅ Modification  
✅ Distribution  
✅ Private use  

📋 License and copyright notice required

---

## 🎯 **Roadmap**

### Coming Soon
- [ ] **Multi-language Support** - i18n integration
- [ ] **Email Analytics** - Open and click tracking
- [ ] **A/B Testing** - Test variations
- [ ] **Collaborative Editing** - Real-time collaboration
- [ ] **Cloud Storage** - Save to cloud
- [ ] **Advanced Scheduling** - Scheduled sends
- [ ] **Contact Management** - Mailing lists
- [ ] **More Templates** - Expanded library
- [ ] **Custom Fonts** - Web font support
- [ ] **Advanced Layouts** - Complex structures

---

## 💬 **Community & Support**

### Get Help
- 📖 [Documentation](https://github.com/ngeff/visual-email-builder/wiki)
- 🐛 [Report Issues](https://github.com/ngeff/visual-email-builder/issues)
- 💡 [Feature Requests](https://github.com/ngeff/visual-email-builder/issues/new)
- 💬 [Discussions](https://github.com/ngeff/visual-email-builder/discussions)

### Stay Updated
- ⭐ Star this repository
- 👀 Watch for updates
- 🔔 Enable notifications

---

## 🏆 **Acknowledgments**

### Built With
- [Express.js](https://expressjs.com/) - Fast, minimalist web framework
- [Nodemailer](https://nodemailer.com/) - Email sending for Node.js
- [Helmet.js](https://helmetjs.github.io/) - Security middleware
- Pure JavaScript - No heavy frameworks

### Special Thanks
- All contributors who helped improve this project
- The open-source community for inspiration
- Email marketing professionals for feedback

---

## 📈 **Stats**

<div align="center">

![GitHub Stars](https://img.shields.io/github/stars/ngeff/visual-email-builder?style=social)
![GitHub Forks](https://img.shields.io/github/forks/ngeff/visual-email-builder?style=social)
![GitHub Issues](https://img.shields.io/github/issues/ngeff/visual-email-builder)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/ngeff/visual-email-builder)
![Last Commit](https://img.shields.io/github/last-commit/ngeff/visual-email-builder)

</div>

---

## 🌟 **Show Your Support**

If this project helped you, please consider:

- ⭐ **Star this repository**
- 🐛 **Report bugs** you find
- 💡 **Suggest features** you need
- 📖 **Improve documentation**
- 🔀 **Submit pull requests**
- 📢 **Share with others**

---

<div align="center">

**[⬆ Back to Top](#-visual-email-builder)**

Made with ❤️ by [NGeff](https://github.com/ngeff) and [contributors](https://github.com/ngeff/visual-email-builder/graphs/contributors)

</div>