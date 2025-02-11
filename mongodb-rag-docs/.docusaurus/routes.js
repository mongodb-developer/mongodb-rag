import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/mongodb-rag/mongodb-rag-docs/helloWorld',
    component: ComponentCreator('/mongodb-rag/mongodb-rag-docs/helloWorld', '970'),
    exact: true
  },
  {
    path: '/mongodb-rag/mongodb-rag-docs/docs',
    component: ComponentCreator('/mongodb-rag/mongodb-rag-docs/docs', '687'),
    routes: [
      {
        path: '/mongodb-rag/mongodb-rag-docs/docs',
        component: ComponentCreator('/mongodb-rag/mongodb-rag-docs/docs', '769'),
        routes: [
          {
            path: '/mongodb-rag/mongodb-rag-docs/docs',
            component: ComponentCreator('/mongodb-rag/mongodb-rag-docs/docs', 'b59'),
            routes: [
              {
                path: '/mongodb-rag/mongodb-rag-docs/docs/api-reference',
                component: ComponentCreator('/mongodb-rag/mongodb-rag-docs/docs/api-reference', '0db'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/mongodb-rag-docs/docs/examples/advanced-example',
                component: ComponentCreator('/mongodb-rag/mongodb-rag-docs/docs/examples/advanced-example', '8c2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/mongodb-rag-docs/docs/examples/basic-example',
                component: ComponentCreator('/mongodb-rag/mongodb-rag-docs/docs/examples/basic-example', '628'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/mongodb-rag-docs/docs/installation',
                component: ComponentCreator('/mongodb-rag/mongodb-rag-docs/docs/installation', '027'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/mongodb-rag-docs/docs/intro',
                component: ComponentCreator('/mongodb-rag/mongodb-rag-docs/docs/intro', 'd2d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/mongodb-rag-docs/docs/usage',
                component: ComponentCreator('/mongodb-rag/mongodb-rag-docs/docs/usage', '6bb'),
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
    path: '/mongodb-rag/mongodb-rag-docs/',
    component: ComponentCreator('/mongodb-rag/mongodb-rag-docs/', 'e61'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
