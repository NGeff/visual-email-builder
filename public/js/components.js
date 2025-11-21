// Components - NO ES6 MODULES
(function(window) {
  'use strict';

  // Wait for utils to be available
  if (!window.EmailBuilderUtils) {
    console.error('EmailBuilderUtils not found! Make sure utils.js is loaded first.');
    return;
  }

  const utils = window.EmailBuilderUtils;
  console.log('Utils available in components:', typeof utils.generateId);

  function BlockComponent(type, data) {
    data = data || {};
    
    try {
      this.id = data.id || utils.generateId();
      console.log('Block ID assigned:', this.id);
    } catch (error) {
      console.error('Error generating ID:', error);
      this.id = 'block-' + Date.now();
    }
    
    this.type = type;
    
    // Merge defaults with provided data
    var defaults = this.getDefaults();
    this.data = {};
    for (var key in defaults) {
      this.data[key] = defaults[key];
    }
    for (var key in data) {
      if (key !== 'id') {
        this.data[key] = data[key];
      }
    }
  }

  BlockComponent.prototype.getDefaults = function() {
    return {};
  };

  BlockComponent.prototype.render = function() {
    return '';
  };

  BlockComponent.prototype.getProperties = function() {
    return [];
  };

  BlockComponent.prototype.toJSON = function() {
    return {
      id: this.id,
      type: this.type,
      data: this.data
    };
  };

  // Text Block
  function TextBlock(type, data) {
    BlockComponent.call(this, type, data);
  }
  TextBlock.prototype = Object.create(BlockComponent.prototype);
  TextBlock.prototype.constructor = TextBlock;

  TextBlock.prototype.getDefaults = function() {
    return {
      content: 'Enter your text here...',
      fontSize: '16',
      color: '#000000',
      align: 'left',
      lineHeight: '1.5',
      fontWeight: 'normal'
    };
  };

  TextBlock.prototype.render = function() {
    const d = this.data;
    return '<p style="font-size: ' + d.fontSize + 'px; color: ' + d.color + '; text-align: ' + d.align + '; line-height: ' + d.lineHeight + '; font-weight: ' + d.fontWeight + '; margin: 0;">' + d.content + '</p>';
  };

  TextBlock.prototype.getProperties = function() {
    return [
      { type: 'textarea', key: 'content', label: 'Content' },
      { type: 'range', key: 'fontSize', label: 'Font Size', min: 12, max: 48, step: 1 },
      { type: 'color', key: 'color', label: 'Text Color' },
      { type: 'select', key: 'align', label: 'Alignment', options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
      ]},
      { type: 'select', key: 'fontWeight', label: 'Font Weight', options: [
        { value: 'normal', label: 'Normal' },
        { value: 'bold', label: 'Bold' }
      ]}
    ];
  };

  // Heading Block
  function HeadingBlock(type, data) {
    BlockComponent.call(this, type, data);
  }
  HeadingBlock.prototype = Object.create(BlockComponent.prototype);
  HeadingBlock.prototype.constructor = HeadingBlock;

  HeadingBlock.prototype.getDefaults = function() {
    return {
      content: 'Heading',
      level: 'h2',
      fontSize: '32',
      color: '#000000',
      align: 'left'
    };
  };

  HeadingBlock.prototype.render = function() {
    const d = this.data;
    return '<' + d.level + ' style="font-size: ' + d.fontSize + 'px; color: ' + d.color + '; text-align: ' + d.align + '; font-weight: bold; margin: 0;">' + d.content + '</' + d.level + '>';
  };

  HeadingBlock.prototype.getProperties = function() {
    return [
      { type: 'text', key: 'content', label: 'Content' },
      { type: 'select', key: 'level', label: 'Level', options: [
        { value: 'h1', label: 'H1' },
        { value: 'h2', label: 'H2' },
        { value: 'h3', label: 'H3' }
      ]},
      { type: 'range', key: 'fontSize', label: 'Font Size', min: 18, max: 72, step: 2 },
      { type: 'color', key: 'color', label: 'Text Color' },
      { type: 'select', key: 'align', label: 'Alignment', options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
      ]}
    ];
  };

  // Image Block
  function ImageBlock(type, data) {
    BlockComponent.call(this, type, data);
  }
  ImageBlock.prototype = Object.create(BlockComponent.prototype);
  ImageBlock.prototype.constructor = ImageBlock;

  ImageBlock.prototype.getDefaults = function() {
    return {
      url: 'https://via.placeholder.com/600x400',
      alt: 'Image',
      width: '100',
      align: 'center'
    };
  };

  ImageBlock.prototype.render = function() {
    const d = this.data;
    const margin = d.align === 'center' ? 'auto' : (d.align === 'right' ? '0 0 0 auto' : '0');
    return '<img src="' + d.url + '" alt="' + d.alt + '" style="max-width: ' + d.width + '%; height: auto; display: block; margin: ' + margin + ';" />';
  };

  ImageBlock.prototype.getProperties = function() {
    return [
      { type: 'text', key: 'url', label: 'Image URL' },
      { type: 'text', key: 'alt', label: 'Alt Text' },
      { type: 'range', key: 'width', label: 'Width (%)', min: 10, max: 100, step: 5 },
      { type: 'select', key: 'align', label: 'Alignment', options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
      ]}
    ];
  };

  // Button Block
  function ButtonBlock(type, data) {
    BlockComponent.call(this, type, data);
  }
  ButtonBlock.prototype = Object.create(BlockComponent.prototype);
  ButtonBlock.prototype.constructor = ButtonBlock;

  ButtonBlock.prototype.getDefaults = function() {
    return {
      text: 'Click Here',
      url: '#',
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
      borderRadius: '8',
      align: 'center'
    };
  };

  ButtonBlock.prototype.render = function() {
    const d = this.data;
    return '<div style="text-align: ' + d.align + ';"><a href="' + d.url + '" style="display: inline-block; background-color: ' + d.backgroundColor + '; color: ' + d.textColor + '; padding: 12px 24px; border-radius: ' + d.borderRadius + 'px; text-decoration: none; font-weight: 600;">' + d.text + '</a></div>';
  };

  ButtonBlock.prototype.getProperties = function() {
    return [
      { type: 'text', key: 'text', label: 'Button Text' },
      { type: 'text', key: 'url', label: 'Link URL' },
      { type: 'color', key: 'backgroundColor', label: 'Background Color' },
      { type: 'color', key: 'textColor', label: 'Text Color' },
      { type: 'range', key: 'borderRadius', label: 'Border Radius', min: 0, max: 50, step: 1 },
      { type: 'select', key: 'align', label: 'Alignment', options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
      ]}
    ];
  };

  // Divider Block
  function DividerBlock(type, data) {
    BlockComponent.call(this, type, data);
  }
  DividerBlock.prototype = Object.create(BlockComponent.prototype);
  DividerBlock.prototype.constructor = DividerBlock;

  DividerBlock.prototype.getDefaults = function() {
    return {
      color: '#e5e7eb',
      thickness: '1',
      width: '100'
    };
  };

  DividerBlock.prototype.render = function() {
    const d = this.data;
    return '<hr style="border: none; border-top: ' + d.thickness + 'px solid ' + d.color + '; width: ' + d.width + '%; margin: 20px auto;" />';
  };

  DividerBlock.prototype.getProperties = function() {
    return [
      { type: 'color', key: 'color', label: 'Color' },
      { type: 'range', key: 'thickness', label: 'Thickness', min: 1, max: 10, step: 1 },
      { type: 'range', key: 'width', label: 'Width (%)', min: 10, max: 100, step: 5 }
    ];
  };

  // Spacer Block
  function SpacerBlock(type, data) {
    BlockComponent.call(this, type, data);
  }
  SpacerBlock.prototype = Object.create(BlockComponent.prototype);
  SpacerBlock.prototype.constructor = SpacerBlock;

  SpacerBlock.prototype.getDefaults = function() {
    return {
      height: '40'
    };
  };

  SpacerBlock.prototype.render = function() {
    return '<div style="height: ' + this.data.height + 'px;"></div>';
  };

  SpacerBlock.prototype.getProperties = function() {
    return [
      { type: 'range', key: 'height', label: 'Height (px)', min: 10, max: 200, step: 10 }
    ];
  };

  // Columns Block
  function ColumnsBlock(type, data) {
    BlockComponent.call(this, type, data);
  }
  ColumnsBlock.prototype = Object.create(BlockComponent.prototype);
  ColumnsBlock.prototype.constructor = ColumnsBlock;

  ColumnsBlock.prototype.getDefaults = function() {
    return {
      columns: '2',
      gap: '20',
      content1: 'Column 1 content',
      content2: 'Column 2 content'
    };
  };

  ColumnsBlock.prototype.render = function() {
    const d = this.data;
    return '<table style="width: 100%; border-collapse: collapse;"><tr><td style="width: 48%; vertical-align: top; padding: 10px;">' + d.content1 + '</td><td style="width: ' + d.gap + 'px;"></td><td style="width: 48%; vertical-align: top; padding: 10px;">' + d.content2 + '</td></tr></table>';
  };

  ColumnsBlock.prototype.getProperties = function() {
    return [
      { type: 'range', key: 'gap', label: 'Gap (px)', min: 0, max: 60, step: 10 },
      { type: 'textarea', key: 'content1', label: 'Column 1' },
      { type: 'textarea', key: 'content2', label: 'Column 2' }
    ];
  };

  // Social Block
  function SocialBlock(type, data) {
    BlockComponent.call(this, type, data);
  }
  SocialBlock.prototype = Object.create(BlockComponent.prototype);
  SocialBlock.prototype.constructor = SocialBlock;

  SocialBlock.prototype.getDefaults = function() {
    return {
      align: 'center',
      iconSize: '32',
      spacing: '10',
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com'
    };
  };

  SocialBlock.prototype.render = function() {
    const d = this.data;
    let html = '<div style="text-align: ' + d.align + ';">';
    if (d.facebook) html += '<a href="' + d.facebook + '" style="display: inline-block; margin: 0 ' + d.spacing + 'px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: ' + d.iconSize + 'px; height: ' + d.iconSize + 'px;" /></a>';
    if (d.twitter) html += '<a href="' + d.twitter + '" style="display: inline-block; margin: 0 ' + d.spacing + 'px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: ' + d.iconSize + 'px; height: ' + d.iconSize + 'px;" /></a>';
    if (d.instagram) html += '<a href="' + d.instagram + '" style="display: inline-block; margin: 0 ' + d.spacing + 'px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" style="width: ' + d.iconSize + 'px; height: ' + d.iconSize + 'px;" /></a>';
    html += '</div>';
    return html;
  };

  SocialBlock.prototype.getProperties = function() {
    return [
      { type: 'select', key: 'align', label: 'Alignment', options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
      ]},
      { type: 'range', key: 'iconSize', label: 'Icon Size', min: 24, max: 64, step: 4 },
      { type: 'text', key: 'facebook', label: 'Facebook URL' },
      { type: 'text', key: 'twitter', label: 'Twitter URL' },
      { type: 'text', key: 'instagram', label: 'Instagram URL' }
    ];
  };

  // Factory
  const componentFactory = {
    text: TextBlock,
    heading: HeadingBlock,
    image: ImageBlock,
    button: ButtonBlock,
    divider: DividerBlock,
    spacer: SpacerBlock,
    columns: ColumnsBlock,
    social: SocialBlock
  };

  function createBlock(type, data) {
    console.log('createBlock called with type:', type, 'data:', data);
    
    if (!type) {
      throw new Error('Block type is required');
    }
    
    const BlockClass = componentFactory[type];
    
    if (!BlockClass) {
      console.error('Available block types:', Object.keys(componentFactory));
      throw new Error('Unknown block type: ' + type);
    }
    
    try {
      data = data || {};
      console.log('Creating new instance of ' + type + ' block');
      var instance = new BlockClass(type, data);
      console.log('Block instance created:', instance);
      return instance;
    } catch (error) {
      console.error('Error creating block instance:', error);
      throw error;
    }
  }

  window.EmailBuilderComponents = {
    createBlock: createBlock
  };

  console.log('✅ Components loaded');
  console.log('Available block types:', Object.keys(componentFactory));

})(window);