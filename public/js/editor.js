// Email Editor - NO ES6 MODULES
(function(window) {
  'use strict';

  const utils = window.EmailBuilderUtils;
  const components = window.EmailBuilderComponents;
  const templatesLib = window.EmailBuilderTemplates;

  function EmailEditor() {
    this.blocks = [];
    this.selectedBlock = null;
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 50;
    this.draggedElement = null;
    
    this.initElements();
    this.initEventListeners();
    this.initDragAndDrop();
    this.loadDraft();
    this.updateUI();
    
    console.log('✅ Email Editor initialized successfully!');
  }

  EmailEditor.prototype.initElements = function() {
    this.editorEl = document.getElementById('emailEditor');
    this.previewEl = document.getElementById('emailPreview');
    this.propertiesPanel = document.getElementById('propertiesPanel');
    this.propertiesContent = document.getElementById('propertiesContent');
    this.blockCountEl = document.getElementById('blockCount');
    this.lastSavedEl = document.getElementById('lastSaved');
  };

  EmailEditor.prototype.initEventListeners = function() {
    const self = this;
    
    // Component buttons
    document.querySelectorAll('.component-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const type = btn.dataset.component;
        console.log('Adding block:', type);
        self.addBlock(type);
      });
    });

    // Toolbar buttons
    const btnUndo = document.getElementById('btnUndo');
    const btnRedo = document.getElementById('btnRedo');
    const btnSave = document.getElementById('btnSave');
    const btnLoad = document.getElementById('btnLoad');
    const btnExport = document.getElementById('btnExport');
    const btnClearAll = document.getElementById('btnClearAll');
    const btnTemplates = document.getElementById('btnTemplates');
    const btnSendEmail = document.getElementById('btnSendEmail');
    const btnTheme = document.getElementById('btnTheme');

    if (btnUndo) btnUndo.addEventListener('click', function() { self.undo(); });
    if (btnRedo) btnRedo.addEventListener('click', function() { self.redo(); });
    if (btnSave) btnSave.addEventListener('click', function() { self.saveDraft(); });
    if (btnLoad) btnLoad.addEventListener('click', function() { self.loadDraftDialog(); });
    if (btnExport) btnExport.addEventListener('click', function() { self.exportHTML(); });
    if (btnClearAll) btnClearAll.addEventListener('click', function() { self.clearAll(); });
    if (btnTemplates) btnTemplates.addEventListener('click', function() { self.showTemplateModal(); });
    if (btnSendEmail) btnSendEmail.addEventListener('click', function() { self.showSendModal(); });
    if (btnTheme) btnTheme.addEventListener('click', function() { self.toggleTheme(); });

    // Import button
    const btnImport = document.getElementById('btnImport');
    if (btnImport) {
      btnImport.addEventListener('click', function() { self.showImportModal(); });
    }

    // Import modal buttons
    const btnImportFile = document.getElementById('btnImportFile');
    const btnImportPaste = document.getElementById('btnImportPaste');
    const btnProcessFile = document.getElementById('btnProcessFile');
    const btnProcessPaste = document.getElementById('btnProcessPaste');

    if (btnImportFile) {
      btnImportFile.addEventListener('click', function() {
        document.getElementById('importFileSection').style.display = 'block';
        document.getElementById('importPasteSection').style.display = 'none';
      });
    }

    if (btnImportPaste) {
      btnImportPaste.addEventListener('click', function() {
        document.getElementById('importFileSection').style.display = 'none';
        document.getElementById('importPasteSection').style.display = 'block';
      });
    }

    if (btnProcessFile) {
      btnProcessFile.addEventListener('click', function() { self.processImportFile(); });
    }

    if (btnProcessPaste) {
      btnProcessPaste.addEventListener('click', function() { self.processImportPaste(); });
    }

    // Preview device buttons
    document.querySelectorAll('.preview-device').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.preview-device').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const device = btn.dataset.device;
        self.previewEl.className = device === 'mobile' ? 'email-preview mobile-view' : 'email-preview desktop-view';
      });
    });

    // Modal controls
    document.querySelectorAll('.modal-backdrop, .modal-close, .modal-cancel').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        self.closeModals();
      });
    });

    // Send email form
    const sendForm = document.getElementById('sendEmailForm');
    if (sendForm) {
      sendForm.addEventListener('submit', function(e) {
        e.preventDefault();
        self.sendEmail();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        self.undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        self.redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        self.saveDraft();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        self.exportHTML();
      } else if (e.key === 'Delete' && self.selectedBlock) {
        e.preventDefault();
        self.removeBlock(self.selectedBlock.id);
      }
    });

    this.debouncedUpdate = utils.debounce(function() { self.updatePreview(); }, 300);
  };

  EmailEditor.prototype.initDragAndDrop = function() {
    const self = this;
    
    this.editorEl.addEventListener('dragstart', function(e) {
      if (e.target.classList.contains('email-block')) {
        e.target.classList.add('dragging');
        self.draggedElement = e.target;
      }
    });

    this.editorEl.addEventListener('dragend', function(e) {
      if (e.target.classList.contains('email-block')) {
        e.target.classList.remove('dragging');
        self.draggedElement = null;
        self.reorderBlocks();
      }
    });

    this.editorEl.addEventListener('dragover', function(e) {
      e.preventDefault();
      const afterElement = self.getDragAfterElement(e.clientY);
      const draggable = self.draggedElement;
      
      if (draggable) {
        if (afterElement == null) {
          self.editorEl.appendChild(draggable);
        } else {
          self.editorEl.insertBefore(draggable, afterElement);
        }
      }
    });

    this.editorEl.addEventListener('drop', function(e) {
      e.preventDefault();
    });
  };

  EmailEditor.prototype.getDragAfterElement = function(y) {
    const draggableElements = Array.from(this.editorEl.querySelectorAll('.email-block:not(.dragging)'));
    
    return draggableElements.reduce(function(closest, child) {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  };

  EmailEditor.prototype.addBlock = function(type, data) {
    try {
      console.log('Creating block of type:', type);
      
      // Ensure data is an object
      data = data || {};
      
      const block = components.createBlock(type, data);
      console.log('Block created successfully:', block);
      
      this.blocks.push(block);
      this.saveHistory();
      this.renderEditor();
      this.updatePreview();
      this.updateUI();
      utils.showNotification(type.charAt(0).toUpperCase() + type.slice(1) + ' block added', 'success');
    } catch (error) {
      console.error('Error adding block:', error);
      console.error('Error details:', {
        type: type,
        data: data,
        message: error.message,
        stack: error.stack
      });
      utils.showNotification('Error: ' + error.message, 'error');
    }
  };

  EmailEditor.prototype.removeBlock = function(id) {
    const self = this;
    this.blocks = this.blocks.filter(function(b) { return b.id !== id; });
    if (this.selectedBlock && this.selectedBlock.id === id) {
      this.selectedBlock = null;
      this.propertiesPanel.style.display = 'none';
    }
    this.saveHistory();
    this.renderEditor();
    this.updatePreview();
    this.updateUI();
  };

  EmailEditor.prototype.selectBlock = function(id) {
    const self = this;
    this.selectedBlock = this.blocks.find(function(b) { return b.id === id; });
    document.querySelectorAll('.email-block').forEach(function(el) { el.classList.remove('active'); });
    const blockEl = document.querySelector('[data-block-id="' + id + '"]');
    if (blockEl) blockEl.classList.add('active');
    this.renderProperties();
  };

  EmailEditor.prototype.updateBlockData = function(id, key, value) {
    const block = this.blocks.find(function(b) { return b.id === id; });
    if (block) {
      block.data[key] = value;
      this.debouncedUpdate();
      this.renderEditor();
    }
  };

  EmailEditor.prototype.reorderBlocks = function() {
    const self = this;
    const blockElements = Array.from(this.editorEl.querySelectorAll('.email-block'));
    const newOrder = blockElements.map(function(el) { return el.dataset.blockId; });
    this.blocks.sort(function(a, b) {
      return newOrder.indexOf(a.id) - newOrder.indexOf(b.id);
    });
    this.saveHistory();
    this.updatePreview();
  };

  EmailEditor.prototype.renderEditor = function() {
    const self = this;
    
    if (this.blocks.length === 0) {
      this.editorEl.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 5v14M5 12h14"/></svg><p>Start building your email by adding components from the left sidebar</p></div>';
      return;
    }

    this.editorEl.innerHTML = this.blocks.map(function(block) {
      const isActive = self.selectedBlock && self.selectedBlock.id === block.id;
      return '<div class="email-block ' + (isActive ? 'active' : '') + '" data-block-id="' + block.id + '" draggable="true"><div class="block-controls"><button class="block-control-btn" data-action="remove" data-block-id="' + block.id + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div><div class="block-content">' + block.render() + '</div></div>';
    }).join('');

    this.editorEl.querySelectorAll('.email-block').forEach(function(el) {
      el.addEventListener('click', function(e) {
        if (!e.target.closest('.block-controls')) {
          self.selectBlock(el.dataset.blockId);
        }
      });
    });

    this.editorEl.querySelectorAll('[data-action="remove"]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        self.removeBlock(btn.dataset.blockId);
      });
    });
  };

  EmailEditor.prototype.renderProperties = function() {
    const self = this;
    
    if (!this.selectedBlock) {
      this.propertiesPanel.style.display = 'none';
      return;
    }

    this.propertiesPanel.style.display = 'block';
    const properties = this.selectedBlock.getProperties();

    this.propertiesContent.innerHTML = properties.map(function(prop) {
      const value = self.selectedBlock.data[prop.key];
      
      switch (prop.type) {
        case 'text':
          return '<div class="property-group"><label class="property-label">' + prop.label + '</label><input type="text" class="property-input" data-key="' + prop.key + '" value="' + (value || '') + '"></div>';
        
        case 'textarea':
          return '<div class="property-group"><label class="property-label">' + prop.label + '</label><textarea class="property-textarea" data-key="' + prop.key + '">' + (value || '') + '</textarea></div>';
        
        case 'color':
          return '<div class="property-group"><label class="property-label">' + prop.label + '</label><div class="property-color-picker"><input type="color" data-key="' + prop.key + '" value="' + (value || '#000000') + '"><input type="text" class="property-input" data-key="' + prop.key + '" value="' + (value || '#000000') + '"></div></div>';
        
        case 'range':
          return '<div class="property-group"><label class="property-label">' + prop.label + ': ' + (value || prop.min) + '</label><input type="range" class="property-range" data-key="' + prop.key + '" min="' + prop.min + '" max="' + prop.max + '" step="' + (prop.step || 1) + '" value="' + (value || prop.min) + '"></div>';
        
        case 'select':
          return '<div class="property-group"><label class="property-label">' + prop.label + '</label><select class="property-select" data-key="' + prop.key + '">' + prop.options.map(function(opt) {
            return '<option value="' + opt.value + '" ' + (value === opt.value ? 'selected' : '') + '>' + opt.label + '</option>';
          }).join('') + '</select></div>';
        
        default:
          return '';
      }
    }).join('');

    this.propertiesContent.querySelectorAll('input, textarea, select').forEach(function(input) {
      input.addEventListener('input', function(e) {
        const key = e.target.dataset.key;
        let value = e.target.value;
        
        if (e.target.type === 'color') {
          const textInput = self.propertiesContent.querySelector('input[type="text"][data-key="' + key + '"]');
          if (textInput) textInput.value = value;
        } else if (e.target.type === 'range') {
          const label = e.target.parentElement.querySelector('.property-label');
          const labelText = label.textContent.split(':')[0];
          label.textContent = labelText + ': ' + value;
        }
        
        self.updateBlockData(self.selectedBlock.id, key, value);
      });
    });
  };

  EmailEditor.prototype.updatePreview = function() {
    const self = this;
    const html = this.blocks.map(function(block) { return block.render(); }).join('\n');
    this.previewEl.innerHTML = '<div class="preview-content">' + html + '</div>';
  };

  EmailEditor.prototype.generateHTML = function() {
    const self = this;
    return this.blocks.map(function(block) { return block.render(); }).join('\n');
  };

  EmailEditor.prototype.exportHTML = function() {
    const html = this.generateFullHTML();
    utils.downloadFile(html, 'email-' + Date.now() + '.html', 'text/html');
    utils.showNotification('Email exported successfully', 'success');
  };

  EmailEditor.prototype.generateFullHTML = function() {
    const content = this.generateHTML();
    return '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Email</title>\n</head>\n<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">\n  <table role="presentation" style="width: 100%; border-collapse: collapse;">\n    <tr>\n      <td style="padding: 40px 20px;">\n        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">\n          <tr>\n            <td style="padding: 40px;">\n              ' + content + '\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>';
  };

  EmailEditor.prototype.saveDraft = function() {
    const self = this;
    const draft = {
      blocks: this.blocks.map(function(b) { return b.toJSON(); }),
      timestamp: Date.now()
    };
    utils.saveToStorage('emailDraft', draft);
    this.lastSavedEl.textContent = 'Saved ' + utils.formatDate(new Date());
    utils.showNotification('Draft saved', 'success');
  };

  EmailEditor.prototype.loadDraft = function() {
    const self = this;
    const draft = utils.loadFromStorage('emailDraft');
    if (draft && draft.blocks) {
      this.blocks = draft.blocks.map(function(b) { return components.createBlock(b.type, b.data); });
      this.renderEditor();
      this.updatePreview();
      this.updateUI();
      this.lastSavedEl.textContent = 'Loaded ' + utils.formatDate(new Date(draft.timestamp));
    }
  };

  EmailEditor.prototype.loadDraftDialog = function() {
    if (confirm('Load your last saved draft? This will replace your current work.')) {
      this.loadDraft();
      utils.showNotification('Draft loaded', 'success');
    }
  };

  EmailEditor.prototype.clearAll = function() {
    if (confirm('Are you sure you want to clear all blocks? This cannot be undone.')) {
      this.blocks = [];
      this.selectedBlock = null;
      this.saveHistory();
      this.renderEditor();
      this.updatePreview();
      this.updateUI();
      utils.showNotification('All blocks cleared', 'success');
    }
  };

  EmailEditor.prototype.showTemplateModal = function() {
    const self = this;
    const modal = document.getElementById('templateModal');
    const grid = document.getElementById('templateGrid');
    
    grid.innerHTML = templatesLib.getAllTemplates().map(function(template) {
      const previewHtml = template.blocks.slice(0, 2).map(function(blockData) {
        const block = components.createBlock(blockData.type, blockData.data);
        return block.render();
      }).join('');
      
      return '<div class="template-card" data-template-id="' + template.id + '"><div class="template-preview">' + previewHtml + '</div><div class="template-info"><div class="template-name">' + template.name + '</div><div class="template-description">' + template.description + '</div></div></div>';
    }).join('');

    grid.querySelectorAll('.template-card').forEach(function(card) {
      card.addEventListener('click', function() {
        self.loadTemplate(card.dataset.templateId);
        self.closeModals();
      });
    });

    modal.classList.add('active');
  };

  EmailEditor.prototype.loadTemplate = function(id) {
    const self = this;
    const template = templatesLib.getTemplate(id);
    if (template) {
      this.blocks = template.blocks.map(function(b) { return components.createBlock(b.type, b.data); });
      this.saveHistory();
      this.renderEditor();
      this.updatePreview();
      this.updateUI();
      utils.showNotification('Template "' + template.name + '" loaded', 'success');
    }
  };

  EmailEditor.prototype.showSendModal = function() {
    if (this.blocks.length === 0) {
      utils.showNotification('Add some content before sending', 'error');
      return;
    }
    document.getElementById('sendModal').classList.add('active');
  };

  EmailEditor.prototype.sendEmail = function() {
    const self = this;
    const recipients = document.getElementById('emailRecipients').value;
    const subject = document.getElementById('emailSubject').value;
    const statusEl = document.getElementById('sendStatus');

    const recipientList = utils.parseRecipients(recipients);
    const invalidEmails = recipientList.filter(function(email) { return !utils.validateEmail(email); });

    if (invalidEmails.length > 0) {
      statusEl.textContent = 'Invalid email addresses: ' + invalidEmails.join(', ');
      statusEl.className = 'alert alert-error';
      statusEl.style.display = 'block';
      return;
    }

    try {
      statusEl.textContent = 'Sending email...';
      statusEl.className = 'alert';
      statusEl.style.display = 'block';

      fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipientList,
          subject: subject,
          html: self.generateFullHTML()
        })
      })
      .then(function(response) { return response.json(); })
      .then(function(result) {
        if (result.success) {
          statusEl.textContent = 'Email sent successfully to ' + result.recipients + ' recipient(s)!';
          statusEl.className = 'alert alert-success';
          utils.showNotification('Email sent successfully', 'success');
          setTimeout(function() { self.closeModals(); }, 2000);
        } else {
          throw new Error(result.error);
        }
      })
      .catch(function(error) {
        statusEl.textContent = 'Error: ' + error.message;
        statusEl.className = 'alert alert-error';
        utils.showNotification('Failed to send email', 'error');
      });
    } catch (error) {
      statusEl.textContent = 'Error: ' + error.message;
      statusEl.className = 'alert alert-error';
      utils.showNotification('Failed to send email', 'error');
    }
  };

  EmailEditor.prototype.closeModals = function() {
    document.querySelectorAll('.modal').forEach(function(modal) {
      modal.classList.remove('active');
    });
    const statusEl = document.getElementById('sendStatus');
    if (statusEl) statusEl.style.display = 'none';
  };

  EmailEditor.prototype.toggleTheme = function() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    utils.saveToStorage('theme', newTheme);
    
    const lightIcon = document.querySelector('.theme-icon-light');
    const darkIcon = document.querySelector('.theme-icon-dark');
    if (newTheme === 'dark') {
      lightIcon.style.display = 'none';
      darkIcon.style.display = 'block';
    } else {
      lightIcon.style.display = 'block';
      darkIcon.style.display = 'none';
    }
    
    utils.showNotification(newTheme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode', 'success');
  };

  EmailEditor.prototype.saveHistory = function() {
    const self = this;
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    this.history.push(JSON.parse(JSON.stringify(this.blocks.map(function(b) { return b.toJSON(); }))));
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
    
    this.updateHistoryButtons();
  };

  EmailEditor.prototype.undo = function() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.loadFromHistory();
    }
  };

  EmailEditor.prototype.redo = function() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.loadFromHistory();
    }
  };

  EmailEditor.prototype.loadFromHistory = function() {
    const self = this;
    const state = this.history[this.historyIndex];
    this.blocks = state.map(function(b) { return components.createBlock(b.type, b.data); });
    this.renderEditor();
    this.updatePreview();
    this.updateUI();
    this.updateHistoryButtons();
  };

  EmailEditor.prototype.updateHistoryButtons = function() {
    const btnUndo = document.getElementById('btnUndo');
    const btnRedo = document.getElementById('btnRedo');
    if (btnUndo) btnUndo.disabled = this.historyIndex <= 0;
    if (btnRedo) btnRedo.disabled = this.historyIndex >= this.history.length - 1;
  };

  EmailEditor.prototype.updateUI = function() {
    this.blockCountEl.textContent = this.blocks.length + ' block' + (this.blocks.length !== 1 ? 's' : '');
  };

  EmailEditor.prototype.showImportModal = function() {
    const modal = document.getElementById('importModal');
    document.getElementById('importFileSection').style.display = 'none';
    document.getElementById('importPasteSection').style.display = 'none';
    document.getElementById('importStatus').style.display = 'none';
    const htmlFileInput = document.getElementById('htmlFileInput');
    if (htmlFileInput) htmlFileInput.value = '';
    const htmlPasteArea = document.getElementById('htmlPasteArea');
    if (htmlPasteArea) htmlPasteArea.value = '';
    modal.classList.add('active');
  };

  EmailEditor.prototype.processImportFile = function() {
    const self = this;
    const fileInput = document.getElementById('htmlFileInput');
    const statusEl = document.getElementById('importStatus');

    if (!fileInput.files || fileInput.files.length === 0) {
      statusEl.textContent = 'Please select a file first';
      statusEl.className = 'alert alert-error';
      statusEl.style.display = 'block';
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      const html = e.target.result;
      self.importHTML(html);
    };

    reader.onerror = function() {
      statusEl.textContent = 'Error reading file';
      statusEl.className = 'alert alert-error';
      statusEl.style.display = 'block';
    };

    reader.readAsText(file);
  };

  EmailEditor.prototype.processImportPaste = function() {
    const htmlPasteArea = document.getElementById('htmlPasteArea');
    const statusEl = document.getElementById('importStatus');
    const html = htmlPasteArea.value.trim();

    if (!html) {
      statusEl.textContent = 'Please paste HTML code first';
      statusEl.className = 'alert alert-error';
      statusEl.style.display = 'block';
      return;
    }

    this.importHTML(html);
  };

  EmailEditor.prototype.importHTML = function(html) {
    const self = this;
    const statusEl = document.getElementById('importStatus');

    try {
      statusEl.textContent = 'Processing HTML...';
      statusEl.className = 'alert';
      statusEl.style.display = 'block';

      console.log('Starting HTML import...');

      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Try multiple strategies to find content
      let contentArea = null;
      
      // Strategy 1: Look for email wrapper tables
      contentArea = doc.querySelector('table[role="presentation"] td[style*="padding"]');
      
      // Strategy 2: Look for main content containers
      if (!contentArea) {
        contentArea = doc.querySelector('main, article, .content, .email-content, #content, [role="main"]');
      }
      
      // Strategy 3: Look for body with content
      if (!contentArea) {
        contentArea = doc.querySelector('body > div, body > table, body > section');
      }
      
      // Strategy 4: Use body directly
      if (!contentArea) {
        contentArea = doc.body;
      }

      console.log('Content area found:', contentArea.tagName);

      // Remove unwanted elements
      contentArea.querySelectorAll('script, style, noscript, meta, link, iframe').forEach(function(el) {
        el.remove();
      });

      const blocks = this.parseHTMLToBlocks(contentArea);

      console.log('Blocks parsed:', blocks.length);

      if (blocks.length === 0) {
        statusEl.textContent = 'No compatible blocks found. The HTML might be too complex or use unsupported structures.';
        statusEl.className = 'alert alert-error';
        
        // Show debug info
        console.log('HTML structure:', contentArea.innerHTML.substring(0, 500));
        console.log('Available elements:', Array.from(contentArea.querySelectorAll('*')).map(function(el) {
          return el.tagName;
        }).join(', '));
        
        return;
      }

      // Replace current blocks
      this.blocks = blocks;
      this.saveHistory();
      this.renderEditor();
      this.updatePreview();
      this.updateUI();

      statusEl.textContent = 'Successfully imported ' + blocks.length + ' block(s)!';
      statusEl.className = 'alert alert-success';
      utils.showNotification('HTML imported: ' + blocks.length + ' blocks', 'success');

      setTimeout(function() {
        self.closeModals();
      }, 2000);

    } catch (error) {
      console.error('Import error:', error);
      statusEl.textContent = 'Error importing HTML: ' + error.message;
      statusEl.className = 'alert alert-error';
      utils.showNotification('Import failed', 'error');
    }
  };

  EmailEditor.prototype.parseHTMLToBlocks = function(container) {
    const self = this;
    const blocks = [];
    
    // Remove scripts, styles, and comments
    const clone = container.cloneNode(true);
    clone.querySelectorAll('script, style, noscript').forEach(function(el) { el.remove(); });
    
    // Get all meaningful elements
    const walker = document.createTreeWalker(
      clone,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );
    
    const processedElements = new Set();
    let currentElement = walker.currentNode;
    
    while (currentElement) {
      if (!processedElements.has(currentElement)) {
        const block = this.parseElementToBlock(currentElement);
        if (block) {
          blocks.push(block);
          processedElements.add(currentElement);
          
          // Mark children as processed to avoid duplicates
          const descendants = currentElement.querySelectorAll('*');
          descendants.forEach(function(desc) {
            processedElements.add(desc);
          });
        }
      }
      currentElement = walker.nextNode();
    }

    return blocks;
  };

  EmailEditor.prototype.parseElementToBlock = function(el) {
    const tagName = el.tagName.toLowerCase();
    const style = el.style;
    const computedStyle = window.getComputedStyle(el);
    const text = this.getCleanText(el);

    try {
      // Skip empty elements (except specific cases)
      if (!text && tagName !== 'img' && tagName !== 'hr' && tagName !== 'div' && tagName !== 'br') {
        return null;
      }

      // HEADINGS (h1-h6)
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(tagName) !== -1) {
        return components.createBlock('heading', {
          content: text || 'Heading',
          level: tagName,
          fontSize: this.extractFontSize(el) || (tagName === 'h1' ? '36' : tagName === 'h2' ? '32' : '24'),
          color: this.extractColor(el) || '#000000',
          align: this.extractTextAlign(el) || 'left'
        });
      }

      // PARAGRAPHS
      if (tagName === 'p') {
        return components.createBlock('text', {
          content: text || 'Text',
          fontSize: this.extractFontSize(el) || '16',
          color: this.extractColor(el) || '#000000',
          align: this.extractTextAlign(el) || 'left',
          fontWeight: this.extractFontWeight(el) || 'normal'
        });
      }

      // SPANS with content (treat as text)
      if (tagName === 'span' && text && !el.querySelector('img, a')) {
        return components.createBlock('text', {
          content: text,
          fontSize: this.extractFontSize(el) || '16',
          color: this.extractColor(el) || '#000000',
          align: this.extractTextAlign(el) || 'left',
          fontWeight: this.extractFontWeight(el) || 'normal'
        });
      }

      // IMAGES
      if (tagName === 'img') {
        const parent = el.parentElement;
        const link = el.closest('a');
        
        return components.createBlock('image', {
          url: el.src || el.getAttribute('data-src') || 'https://via.placeholder.com/600x400',
          alt: el.alt || 'Image',
          width: this.extractWidth(el) || '100',
          align: this.extractTextAlign(parent) || 'center',
          linkUrl: link ? link.href : ''
        });
      }

      // BUTTONS - Multiple detection methods
      if (this.isButton(el)) {
        const buttonData = this.extractButtonData(el);
        return components.createBlock('button', buttonData);
      }

      // DIVIDERS (hr, borders, etc)
      if (tagName === 'hr' || this.isDivider(el)) {
        return components.createBlock('divider', {
          thickness: this.extractBorderThickness(el) || '1',
          color: this.extractBorderColor(el) || '#e5e7eb',
          width: this.extractWidth(el) || '100'
        });
      }

      // SPACERS (empty divs with height)
      if (this.isSpacer(el)) {
        return components.createBlock('spacer', {
          height: parseInt(style.height || computedStyle.height) || '40'
        });
      }

      // TABLES - Check if it's a layout table or column structure
      if (tagName === 'table') {
        const columnBlock = this.parseTableAsColumns(el);
        if (columnBlock) return columnBlock;
      }

      // DIVS with specific content
      if (tagName === 'div' || tagName === 'section' || tagName === 'article') {
        // Check for button inside
        const buttonLink = el.querySelector('a');
        if (buttonLink && this.isButton(buttonLink)) {
          const buttonData = this.extractButtonData(buttonLink);
          buttonData.align = this.extractTextAlign(el) || 'center';
          return components.createBlock('button', buttonData);
        }

        // Check for image inside
        const img = el.querySelector('img');
        if (img && !el.querySelector('p, h1, h2, h3, h4, h5, h6, ul, ol')) {
          const link = el.querySelector('a');
          return components.createBlock('image', {
            url: img.src || img.getAttribute('data-src') || 'https://via.placeholder.com/600x400',
            alt: img.alt || 'Image',
            width: this.extractWidth(img) || '100',
            align: this.extractTextAlign(el) || 'center',
            linkUrl: link ? link.href : ''
          });
        }

        // Check for social media links
        const socialBlock = this.parseSocialLinks(el);
        if (socialBlock) return socialBlock;

        // If div has text content and no complex children, treat as text
        if (text && !el.querySelector('table, div, section')) {
          return components.createBlock('text', {
            content: text,
            fontSize: this.extractFontSize(el) || '16',
            color: this.extractColor(el) || '#000000',
            align: this.extractTextAlign(el) || 'left',
            fontWeight: this.extractFontWeight(el) || 'normal'
          });
        }
      }

      // LINKS styled as text
      if (tagName === 'a' && !this.isButton(el)) {
        return components.createBlock('text', {
          content: text || 'Link',
          fontSize: this.extractFontSize(el) || '16',
          color: this.extractColor(el) || '#6366f1',
          align: this.extractTextAlign(el) || 'left',
          fontWeight: this.extractFontWeight(el) || 'normal'
        });
      }

      // LISTS - Convert to text blocks
      if (tagName === 'ul' || tagName === 'ol') {
        const items = Array.from(el.querySelectorAll('li'));
        if (items.length > 0) {
          const listText = items.map(function(li, idx) {
            return (tagName === 'ol' ? (idx + 1) + '. ' : '• ') + li.textContent.trim();
          }).join('\n');
          
          return components.createBlock('text', {
            content: listText,
            fontSize: this.extractFontSize(el) || '16',
            color: this.extractColor(el) || '#000000',
            align: this.extractTextAlign(el) || 'left',
            fontWeight: 'normal'
          });
        }
      }

      // BLOCKQUOTE
      if (tagName === 'blockquote') {
        return components.createBlock('text', {
          content: text || 'Quote',
          fontSize: this.extractFontSize(el) || '18',
          color: this.extractColor(el) || '#6b7280',
          align: this.extractTextAlign(el) || 'left',
          fontWeight: 'normal'
        });
      }

      // STRONG, B, EM, I - Extract as bold/italic text
      if (['strong', 'b', 'em', 'i'].indexOf(tagName) !== -1) {
        const isBold = tagName === 'strong' || tagName === 'b';
        return components.createBlock('text', {
          content: text || 'Text',
          fontSize: this.extractFontSize(el) || '16',
          color: this.extractColor(el) || '#000000',
          align: this.extractTextAlign(el) || 'left',
          fontWeight: isBold ? 'bold' : 'normal'
        });
      }

    } catch (error) {
      console.error('Error parsing element:', error, el);
    }

    return null;
  };

  // Helper functions for better parsing
  EmailEditor.prototype.getCleanText = function(el) {
    const clone = el.cloneNode(true);
    // Remove nested complex elements
    clone.querySelectorAll('table, div, section, article').forEach(function(nested) {
      if (nested !== clone) nested.remove();
    });
    return clone.textContent.trim();
  };

  EmailEditor.prototype.extractFontSize = function(el) {
    const style = el.style;
    const computed = window.getComputedStyle(el);
    
    const fontSize = style.fontSize || computed.fontSize;
    if (!fontSize) return null;
    
    const match = fontSize.match(/(\d+)/);
    return match ? match[1] : null;
  };

  EmailEditor.prototype.extractColor = function(el) {
    const style = el.style;
    const computed = window.getComputedStyle(el);
    
    const color = style.color || computed.color;
    return this.rgbToHex(color);
  };

  EmailEditor.prototype.extractTextAlign = function(el) {
    const style = el.style;
    const computed = window.getComputedStyle(el);
    
    return style.textAlign || computed.textAlign || null;
  };

  EmailEditor.prototype.extractFontWeight = function(el) {
    const style = el.style;
    const computed = window.getComputedStyle(el);
    
    const weight = style.fontWeight || computed.fontWeight;
    if (weight === 'bold' || parseInt(weight) >= 600) return 'bold';
    return 'normal';
  };

  EmailEditor.prototype.extractWidth = function(el) {
    const style = el.style;
    const computed = window.getComputedStyle(el);
    
    const width = style.width || style.maxWidth || computed.width || computed.maxWidth;
    if (!width) return null;
    
    const match = width.match(/(\d+)/);
    return match ? match[1] : null;
  };

  EmailEditor.prototype.extractBorderThickness = function(el) {
    const style = el.style;
    const computed = window.getComputedStyle(el);
    
    const border = style.borderTop || style.border || computed.borderTop || computed.border;
    const match = border.match(/(\d+)px/);
    return match ? match[1] : null;
  };

  EmailEditor.prototype.extractBorderColor = function(el) {
    const style = el.style;
    const computed = window.getComputedStyle(el);
    
    const border = style.borderTop || style.border || computed.borderTop || computed.border;
    const colorMatch = border.match(/(#[0-9a-fA-F]{6}|rgb\([^)]+\))/);
    return colorMatch ? this.rgbToHex(colorMatch[1]) : null;
  };

  EmailEditor.prototype.isButton = function(el) {
    const style = el.style;
    const computed = window.getComputedStyle(el);
    const tagName = el.tagName.toLowerCase();
    const classList = el.className.toLowerCase();
    
    // Check tag
    if (tagName === 'button') return true;
    
    // Check common button classes (Bootstrap, Tailwind, etc)
    const buttonClasses = [
      'button', 'btn', 'cta', 'call-to-action',
      'btn-primary', 'btn-secondary', 'btn-success', 'btn-danger', 'btn-warning', 'btn-info',
      'bg-blue', 'bg-green', 'bg-red', 'bg-purple', 'bg-indigo', 'bg-pink',
      'rounded', 'pill'
    ];
    
    const hasButtonClass = buttonClasses.some(function(cls) {
      return classList.includes(cls);
    });
    
    if (hasButtonClass) return true;
    
    // Check if it's a link with button styling
    if (tagName === 'a') {
      const bg = style.backgroundColor || computed.backgroundColor;
      const hasBackground = bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
      const display = style.display || computed.display;
      const hasDisplay = display === 'inline-block' || display === 'block';
      const padding = parseInt(style.padding || computed.padding);
      const hasPadding = padding > 5;
      const borderRadius = parseInt(style.borderRadius || computed.borderRadius);
      const hasRadius = borderRadius > 0;
      
      if (hasBackground && (hasDisplay || hasPadding || hasRadius)) return true;
      
      // Check for text-decoration none with padding (common button pattern)
      const textDecoration = style.textDecoration || computed.textDecoration;
      if (textDecoration === 'none' && hasPadding && hasBackground) return true;
    }
    
    return false;
  };

  EmailEditor.prototype.extractButtonData = function(el) {
    const parent = el.parentElement;
    
    return {
      text: el.textContent.trim() || 'Button',
      url: el.href || el.getAttribute('href') || '#',
      backgroundColor: this.extractBackgroundColor(el) || '#6366f1',
      textColor: this.extractColor(el) || '#ffffff',
      borderRadius: parseInt(el.style.borderRadius || window.getComputedStyle(el).borderRadius) || '8',
      align: this.extractTextAlign(parent) || 'center'
    };
  };

  EmailEditor.prototype.extractBackgroundColor = function(el) {
    const style = el.style;
    const computed = window.getComputedStyle(el);
    
    const bg = style.backgroundColor || computed.backgroundColor;
    return this.rgbToHex(bg);
  };

  EmailEditor.prototype.isDivider = function(el) {
    const style = el.style;
    const computed = window.getComputedStyle(el);
    
    const hasBorder = style.borderTop || style.borderBottom || computed.borderTop !== 'none';
    const isEmpty = !el.textContent.trim();
    const isShort = parseInt(style.height || computed.height) < 10;
    
    return hasBorder && isEmpty && isShort;
  };

  EmailEditor.prototype.isSpacer = function(el) {
    const style = el.style;
    const computed = window.getComputedStyle(el);
    const tagName = el.tagName.toLowerCase();
    
    if (tagName !== 'div') return false;
    
    const isEmpty = !el.textContent.trim() && !el.querySelector('img, a, button');
    const hasHeight = parseInt(style.height || computed.height) > 0;
    
    return isEmpty && hasHeight;
  };

  EmailEditor.prototype.parseTableAsColumns = function(table) {
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) return null;
    
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll('td, th');
    
    // Only handle 2-3 cell layouts (2 columns + optional spacer)
    if (cells.length < 2 || cells.length > 3) return null;
    
    const content1 = this.getCleanText(cells[0]);
    const content2 = this.getCleanText(cells[cells.length - 1]);
    
    if (!content1 && !content2) return null;
    
    return components.createBlock('columns', {
      gap: cells.length === 3 ? '20' : '10',
      content1: content1 || 'Column 1',
      content2: content2 || 'Column 2'
    });
  };

  EmailEditor.prototype.parseSocialLinks = function(el) {
    const links = el.querySelectorAll('a');
    if (links.length < 2) return null;
    
    const socialData = {
      align: this.extractTextAlign(el) || 'center',
      iconSize: '32',
      spacing: '10',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    };
    
    let foundSocial = false;
    
    links.forEach(function(link) {
      const href = link.href.toLowerCase();
      const img = link.querySelector('img');
      
      if (href.includes('facebook.com')) {
        socialData.facebook = link.href;
        foundSocial = true;
      } else if (href.includes('twitter.com') || href.includes('x.com')) {
        socialData.twitter = link.href;
        foundSocial = true;
      } else if (href.includes('instagram.com')) {
        socialData.instagram = link.href;
        foundSocial = true;
      } else if (href.includes('linkedin.com')) {
        socialData.linkedin = link.href;
        foundSocial = true;
      }
      
      if (img) {
        const size = parseInt(img.style.width || img.width);
        if (size) socialData.iconSize = size.toString();
      }
    });
    
    return foundSocial ? components.createBlock('social', socialData) : null;
  };

  EmailEditor.prototype.rgbToHex = function(rgb) {
    if (!rgb || rgb === 'transparent') return null;
    if (rgb.startsWith('#')) return rgb;
    
    // Handle rgba with transparency
    const rgbaMatch = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
    if (!rgbaMatch) return null;
    
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    
    // Skip if it's basically transparent/white
    if (r === 0 && g === 0 && b === 0) return '#000000';
    if (r === 255 && g === 255 && b === 255) return '#ffffff';
    
    return '#' + [r, g, b].map(function(x) {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Load theme
  function loadTheme() {
    const savedTheme = utils.loadFromStorage('theme', 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    const lightIcon = document.querySelector('.theme-icon-light');
    const darkIcon = document.querySelector('.theme-icon-dark');
    if (savedTheme === 'dark' && lightIcon && darkIcon) {
      lightIcon.style.display = 'none';
      darkIcon.style.display = 'block';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadTheme();
      new EmailEditor();
    });
  } else {
    loadTheme();
    new EmailEditor();
  }

  console.log('✅ Editor script loaded');

})(window);