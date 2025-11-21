const validator = require('validator');
const { emailConfig } = require('../config/email.config');

const validateEmailInput = ({ recipients, subject, html }) => {
  const errors = [];

  if (!recipients) {
    errors.push('Recipients are required');
  } else {
    const recipientList = Array.isArray(recipients) 
      ? recipients 
      : recipients.split(',').map(e => e.trim());

    recipientList.forEach(email => {
      if (!validator.isEmail(email)) {
        errors.push(`Invalid email address: ${email}`);
      }
    });
  }

  if (!subject || subject.trim().length === 0) {
    errors.push('Subject is required');
  } else if (subject.length > emailConfig.limits.maxSubjectLength) {
    errors.push(`Subject too long (max ${emailConfig.limits.maxSubjectLength} characters)`);
  }

  if (!html || html.trim().length === 0) {
    errors.push('Email content is required');
  } else if (Buffer.byteLength(html, 'utf8') > emailConfig.limits.maxHtmlSize) {
    errors.push('Email content too large');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

const sanitizeHtml = (html) => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
};

module.exports = {
  validateEmailInput,
  sanitizeHtml
};