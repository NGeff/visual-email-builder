const { getTransporter, emailConfig } = require('../config/email.config');
const { validateEmailInput, sanitizeHtml } = require('../utils/validators');

class EmailController {
  async send(req, res) {
    try {
      const { recipients, subject, html, plainText } = req.body;

      const validation = validateEmailInput({ recipients, subject, html });
      if (!validation.valid) {
        return res.status(400).json({ 
          success: false, 
          error: validation.errors.join(', ') 
        });
      }

      const sanitizedHtml = sanitizeHtml(html);
      const recipientList = Array.isArray(recipients) 
        ? recipients 
        : recipients.split(',').map(e => e.trim());

      if (recipientList.length > emailConfig.limits.maxRecipients) {
        return res.status(400).json({
          success: false,
          error: `Maximum ${emailConfig.limits.maxRecipients} recipients allowed`
        });
      }

      const transporter = getTransporter();
      const info = await transporter.sendMail({
        from: `${emailConfig.sender.name} <${emailConfig.sender.email}>`,
        to: recipientList,
        subject: subject.trim(),
        html: sanitizedHtml,
        text: plainText || this.htmlToText(sanitizedHtml)
      });

      console.log('Email sent:', {
        messageId: info.messageId,
        recipients: recipientList.length,
        subject: subject.substring(0, 50)
      });

      res.json({ 
        success: true, 
        messageId: info.messageId,
        recipients: recipientList.length
      });

    } catch (error) {
      console.error('Email sending error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send email. Please try again later.' 
      });
    }
  }

  async preview(req, res) {
    try {
      const { html } = req.body;

      if (!html) {
        return res.status(400).json({ 
          success: false, 
          error: 'HTML content is required' 
        });
      }

      const sanitizedHtml = sanitizeHtml(html);

      res.json({ 
        success: true, 
        html: sanitizedHtml 
      });

    } catch (error) {
      console.error('Preview error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate preview' 
      });
    }
  }

  async validate(req, res) {
    try {
      const { recipients, subject, html } = req.body;
      
      const validation = validateEmailInput({ recipients, subject, html });
      
      res.json({
        valid: validation.valid,
        errors: validation.errors
      });

    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({ 
        valid: false, 
        errors: ['Validation failed'] 
      });
    }
  }

  htmlToText(html) {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

module.exports = new EmailController();