const nodemailer = require('nodemailer');

const validateEmailConfig = () => {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SENDER_EMAIL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required email configuration: ${missing.join(', ')}`);
  }
};

const createTransporter = () => {
  validateEmailConfig();
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5
  });
};

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

const verifyConnection = async () => {
  try {
    const transport = getTransporter();
    await transport.verify();
    console.log('✓ SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('✗ SMTP connection failed:', error.message);
    return false;
  }
};

const emailConfig = {
  sender: {
    email: process.env.SENDER_EMAIL,
    name: process.env.SENDER_NAME || 'Visual Email Builder'
  },
  limits: {
    maxRecipients: 50,
    maxSubjectLength: 200,
    maxHtmlSize: 5 * 1024 * 1024
  }
};

module.exports = {
  getTransporter,
  verifyConnection,
  emailConfig
};