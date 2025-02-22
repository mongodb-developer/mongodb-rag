import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/mongodb-rag/blog',
    component: ComponentCreator('/mongodb-rag/blog', 'bf8'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/2025/02/01/simplifying',
    component: ComponentCreator('/mongodb-rag/blog/2025/02/01/simplifying', '0bb'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/2025/03/15/workshop-introduction',
    component: ComponentCreator('/mongodb-rag/blog/2025/03/15/workshop-introduction', '08b'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/archive',
    component: ComponentCreator('/mongodb-rag/blog/archive', 'ff7'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags',
    component: ComponentCreator('/mongodb-rag/blog/tags', 'e3a'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/ai',
    component: ComponentCreator('/mongodb-rag/blog/tags/ai', '019'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/blog',
    component: ComponentCreator('/mongodb-rag/blog/tags/blog', '723'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/docusaurus',
    component: ComponentCreator('/mongodb-rag/blog/tags/docusaurus', '595'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/mongodb',
    component: ComponentCreator('/mongodb-rag/blog/tags/mongodb', '596'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/rag',
    component: ComponentCreator('/mongodb-rag/blog/tags/rag', 'ca6'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/tutorial',
    component: ComponentCreator('/mongodb-rag/blog/tags/tutorial', '204'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/vector-search',
    component: ComponentCreator('/mongodb-rag/blog/tags/vector-search', '7a1'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/workshop',
    component: ComponentCreator('/mongodb-rag/blog/tags/workshop', 'b3c'),
    exact: true
  },
  {
    path: '/mongodb-rag/chatbot',
    component: ComponentCreator('/mongodb-rag/chatbot', '32d'),
    exact: true
  },
  {
    path: '/mongodb-rag/helloWorld',
    component: ComponentCreator('/mongodb-rag/helloWorld', '700'),
    exact: true
  },
  {
    path: '/mongodb-rag/docs',
    component: ComponentCreator('/mongodb-rag/docs', 'f63'),
    routes: [
      {
        path: '/mongodb-rag/docs',
        component: ComponentCreator('/mongodb-rag/docs', '054'),
        routes: [
          {
            path: '/mongodb-rag/docs',
            component: ComponentCreator('/mongodb-rag/docs', 'c7a'),
            routes: [
              {
                path: '/mongodb-rag/docs/api-reference',
                component: ComponentCreator('/mongodb-rag/docs/api-reference', 'd42'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/cli-reference',
                component: ComponentCreator('/mongodb-rag/docs/cli-reference', '234'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/create-rag-app',
                component: ComponentCreator('/mongodb-rag/docs/create-rag-app', 'c20'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/examples/advanced-example',
                component: ComponentCreator('/mongodb-rag/docs/examples/advanced-example', '3c6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/examples/basic-example',
                component: ComponentCreator('/mongodb-rag/docs/examples/basic-example', '806'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/installation',
                component: ComponentCreator('/mongodb-rag/docs/installation', '159'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/intro',
                component: ComponentCreator('/mongodb-rag/docs/intro', '8ba'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/usage',
                component: ComponentCreator('/mongodb-rag/docs/usage', '941'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/advanced-techniques',
                component: ComponentCreator('/mongodb-rag/docs/workshop/advanced-techniques', 'd05'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/build-rag-app',
                component: ComponentCreator('/mongodb-rag/docs/workshop/build-rag-app', 'ef1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/create-embeddings',
                component: ComponentCreator('/mongodb-rag/docs/workshop/create-embeddings', 'ea7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/introduction',
                component: ComponentCreator('/mongodb-rag/docs/workshop/introduction', '16d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/production-deployment',
                component: ComponentCreator('/mongodb-rag/docs/workshop/production-deployment', 'ae0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/rag-concepts',
                component: ComponentCreator('/mongodb-rag/docs/workshop/rag-concepts', '15a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/setup-mongodb',
                component: ComponentCreator('/mongodb-rag/docs/workshop/setup-mongodb', 'fbf'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/understanding-hybrid-search',
                component: ComponentCreator('/mongodb-rag/docs/workshop/understanding-hybrid-search', 'eb6'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/mongodb-rag/',
    component: ComponentCreator('/mongodb-rag/', '2ae'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
