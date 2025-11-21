# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-15

### Added
- Initial release of Visual Email Builder
- Drag-and-drop email editor with 8 component types
  - Text blocks with full styling control
  - Heading blocks with customizable levels
  - Image blocks with alignment and linking
  - Button blocks with hover effects
  - Divider lines with style options
  - Spacer blocks for layout control
  - Multi-column layouts
  - Social media icon sets
- Real-time preview panel with desktop/mobile views
- Professional template library
  - Welcome email template
  - Newsletter template
  - Promotional email template
  - Transactional email template
  - Blank canvas option
- Complete property panel for block customization
- Undo/Redo functionality with 50-step history
- Draft saving and loading via localStorage
- HTML export functionality
- Direct email sending via SMTP
- Dark mode support
- Keyboard shortcuts
  - Ctrl/Cmd + Z: Undo
  - Ctrl/Cmd + Y: Redo
  - Ctrl/Cmd + S: Save draft
  - Ctrl/Cmd + E: Export HTML
  - Delete: Remove selected block
- Comprehensive security features
  - HTML sanitization
  - XSS protection
  - Rate limiting
  - CORS configuration
  - Security headers via Helmet
- Email validation and recipient parsing
- Responsive design for all screen sizes
- Professional UI with modern design system
- Accessibility-first approach
- Complete documentation
  - README with quick start guide
  - Contributing guidelines
  - Security policy
  - License (MIT)

### Security
- Input sanitization for all user content
- Script tag removal from HTML
- Email address validation
- Rate limiting on API endpoints
- SMTP credential protection via environment variables
- Secure headers configuration

### Developer Experience
- Modular architecture with separation of concerns
- ES6 modules for clean code organization
- Comprehensive error handling
- Detailed logging
- Environment-based configuration
- Development and production modes

## [Unreleased]

### Planned Features
- Multi-language support
- Email analytics integration
- A/B testing capabilities
- Collaborative editing
- Cloud storage integration
- Advanced scheduling
- Contact list management
- Additional templates
- Automated testing suite
- CI/CD pipeline
- Docker support
- Custom domain support
- Email template marketplace

---

## Release Notes

### Version 1.0.0

This is the first stable release of Visual Email Builder. It includes all core features needed for professional email composition and sending. The application has been thoroughly tested and is ready for production use.

Key highlights:
- Complete visual email builder with 8 component types
- Professional templates for common use cases
- Real-time preview with device switching
- Full SMTP integration for direct sending
- Modern, accessible UI with dark mode
- Comprehensive security features
- Extensive documentation

### Breaking Changes
None - this is the initial release.

### Migration Guide
Not applicable - this is the initial release.

### Known Issues
None at this time. Please report any issues on GitHub.

---

For more information about releases, visit our [GitHub Releases page](https://github.com/NGeff/visual-email-builder/releases).