# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Visual Email Builder seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: geff@gldsolutions.xyz

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:

* Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
* Full paths of source file(s) related to the manifestation of the issue
* The location of the affected source code (tag/branch/commit or direct URL)
* Any special configuration required to reproduce the issue
* Step-by-step instructions to reproduce the issue
* Proof-of-concept or exploit code (if possible)
* Impact of the issue, including how an attacker might exploit it

## Security Best Practices

When deploying Visual Email Builder in production:

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique passwords for SMTP credentials
- Rotate credentials regularly

### SMTP Configuration
- Use app-specific passwords when available (e.g., Gmail)
- Enable 2FA on email accounts used for sending
- Monitor sending limits and unusual activity

### Server Security
- Keep Node.js and all dependencies up to date
- Use HTTPS in production environments
- Implement proper firewall rules
- Use a reverse proxy (nginx, Apache)

### Rate Limiting
- The application includes built-in rate limiting
- Adjust limits based on your use case
- Monitor for abuse patterns

### Input Validation
- All user inputs are sanitized
- HTML content is cleaned to prevent XSS
- Email addresses are validated before sending

### API Security
- CORS is configured - update allowed origins
- Helmet.js is used for security headers
- Request size limits are enforced

## Known Security Considerations

### HTML Email Content
- User-generated HTML is sanitized before rendering
- JavaScript is stripped from email content
- External resources in emails should be from trusted sources

### SMTP Credentials
- SMTP credentials are stored in environment variables
- Never expose credentials in client-side code
- Use environment-specific configurations

### Data Storage
- Drafts are stored in browser localStorage
- No sensitive data should be stored in drafts
- Consider implementing server-side storage for sensitive use cases

## Updates and Patches

Security patches will be released as soon as possible after a vulnerability is confirmed. We recommend:

- Watch this repository for security updates
- Subscribe to release notifications
- Keep your installation up to date
- Review the CHANGELOG for security-related updates

## Compliance

Visual Email Builder is designed with privacy and security in mind:

- No user data is collected or transmitted to third parties
- Email content is only sent to specified SMTP servers
- No analytics or tracking is included by default

## Contact

For security-related questions that are not vulnerabilities, please open a GitHub issue or contact the maintainers directly.

Thank you for helping keep Visual Email Builder and its users safe!