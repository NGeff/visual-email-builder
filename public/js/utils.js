// Utils - NO ES6 MODULES
(function(window) {
  'use strict';

  window.EmailBuilderUtils = {
    generateId: function() {
      var id = 'block-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      console.log('Generated ID:', id);
      return id;
    },

    debounce: function(func, wait) {
      let timeout;
      return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
          clearTimeout(timeout);
          func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    downloadFile: function(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },

    validateEmail: function(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },

    parseRecipients: function(input) {
      return input
        .split(',')
        .map(function(email) { return email.trim(); })
        .filter(function(email) { return email.length > 0; });
    },

    formatDate: function(date) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },

    showNotification: function(message, type) {
      type = type || 'info';
      const notification = document.createElement('div');
      notification.className = 'notification notification-' + type;
      notification.textContent = message;
      notification.style.cssText = 
        'position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem; ' +
        'background: ' + (type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6') + '; ' +
        'color: white; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); ' +
        'z-index: 9999; animation: slideInRight 0.3s ease;';
      
      document.body.appendChild(notification);
      
      setTimeout(function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(function() { notification.remove(); }, 300);
      }, 3000);
    },

    loadFromStorage: function(key, defaultValue) {
      defaultValue = defaultValue || null;
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error loading from storage:', error);
        return defaultValue;
      }
    },

    saveToStorage: function(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error saving to storage:', error);
        return false;
      }
    }
  };

  console.log('✅ Utils loaded');

})(window);