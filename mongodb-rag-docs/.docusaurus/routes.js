import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/mongodb-rag/helloWorld',
    component: ComponentCreator('/mongodb-rag/helloWorld', '700'),
    exact: true
  },
  {
    path: '/mongodb-rag/docs',
    component: ComponentCreator('/mongodb-rag/docs', 'f69'),
    routes: [
      {
        path: '/mongodb-rag/docs',
        component: ComponentCreator('/mongodb-rag/docs', '37f'),
        routes: [
          {
            path: '/mongodb-rag/docs',
            component: ComponentCreator('/mongodb-rag/docs', '432'),
            routes: [
              {
                path: '/mongodb-rag/docs/api-reference',
                component: ComponentCreator('/mongodb-rag/docs/api-reference', 'd42'),
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
