module.exports = {
  docs: [
      'intro',
      'installation',
      'usage',
      'cli-reference',
      {
        type: 'category',
        label: 'Examples',
        collapsed: false,
        items: [
          'examples/basic-example',
          'examples/advanced-example',
        ],
      },
      'create-rag-app',
      'api-reference',
      {
        type: 'category',
        label: 'Workshop',
        collapsed: false,
        items: [
          'workshop/introduction',
          'workshop/rag-concepts',
          'workshop/setup-mongodb',
          'workshop/create-embeddings',
          'workshop/build-rag-app',
          'workshop/advanced-techniques',
          'workshop/production-deployment',
        ],
      },
    ],
};