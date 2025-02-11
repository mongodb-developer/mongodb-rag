const config = {
    title: 'MongoDB-RAG',
    tagline: 'Retrieval-Augmented Generation with MongoDB',
    url: 'https://mongodb-developer.github.io',
    baseUrl: '/mongodb-rag/',
    organizationName: 'mongodb-developer',
    projectName: 'mongodb-rag',
    trailingSlash: false,
    
    presets: [
      [
        '@docusaurus/preset-classic',
        {
          docs: {
            sidebarPath: require.resolve('./sidebars.js'),
            editUrl: 'https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/',
          },
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
        },
      ],
    ],
  
    themeConfig: {
      navbar: {
        title: 'MongoDB-RAG',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/mongodb-developer/mongodb-rag',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Documentation',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/mongodb-developer/mongodb-rag',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} MongoDB. Built with Docusaurus.`,
      },
    },
  };
  
  module.exports = config;