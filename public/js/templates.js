(function(window) {
  'use strict';

  const templates = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      description: 'Perfect for welcoming new users',
      blocks: [
        {
          type: 'heading',
          data: {
            content: 'Welcome to Our Community!',
            level: 'h1',
            fontSize: '36',
            color: '#111827',
            align: 'center'
          }
        },
        {
          type: 'spacer',
          data: { height: '20' }
        },
        {
          type: 'text',
          data: {
            content: "We're thrilled to have you on board. Get ready to explore amazing features!",
            fontSize: '16',
            color: '#6b7280',
            align: 'center'
          }
        },
        {
          type: 'spacer',
          data: { height: '30' }
        },
        {
          type: 'button',
          data: {
            text: 'Get Started',
            url: 'https://example.com',
            backgroundColor: '#6366f1',
            textColor: '#ffffff',
            align: 'center'
          }
        }
      ]
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Share updates and news',
      blocks: [
        {
          type: 'heading',
          data: {
            content: 'Weekly Newsletter',
            level: 'h1',
            fontSize: '32',
            color: '#111827',
            align: 'left'
          }
        },
        {
          type: 'text',
          data: {
            content: 'December 2024',
            fontSize: '14',
            color: '#9ca3af',
            align: 'left'
          }
        },
        {
          type: 'spacer',
          data: { height: '30' }
        },
        {
          type: 'image',
          data: {
            url: 'https://via.placeholder.com/600x300',
            alt: 'Featured Image',
            width: '100',
            align: 'center'
          }
        },
        {
          type: 'spacer',
          data: { height: '20' }
        },
        {
          type: 'heading',
          data: {
            content: 'Featured Story',
            level: 'h2',
            fontSize: '24',
            color: '#111827',
            align: 'left'
          }
        },
        {
          type: 'text',
          data: {
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            fontSize: '16',
            color: '#374151',
            align: 'left'
          }
        }
      ]
    },
    {
      id: 'promotional',
      name: 'Promotional',
      description: 'Announce sales and offers',
      blocks: [
        {
          type: 'heading',
          data: {
            content: '🎉 SPECIAL OFFER',
            level: 'h1',
            fontSize: '40',
            color: '#ef4444',
            align: 'center'
          }
        },
        {
          type: 'spacer',
          data: { height: '20' }
        },
        {
          type: 'heading',
          data: {
            content: '50% OFF',
            level: 'h2',
            fontSize: '48',
            color: '#111827',
            align: 'center'
          }
        },
        {
          type: 'text',
          data: {
            content: 'Limited Time Only',
            fontSize: '18',
            color: '#6b7280',
            align: 'center'
          }
        },
        {
          type: 'spacer',
          data: { height: '30' }
        },
        {
          type: 'button',
          data: {
            text: 'Shop Now',
            url: 'https://example.com',
            backgroundColor: '#ef4444',
            textColor: '#ffffff',
            align: 'center'
          }
        }
      ]
    },
    {
      id: 'blank',
      name: 'Blank Canvas',
      description: 'Start from scratch',
      blocks: []
    }
  ];

  function getTemplate(id) {
    return templates.find(function(t) { return t.id === id; });
  }

  function getAllTemplates() {
    return templates;
  }

  window.EmailBuilderTemplates = {
    getTemplate: getTemplate,
    getAllTemplates: getAllTemplates
  };

  console.log('✅ Templates loaded');

})(window);