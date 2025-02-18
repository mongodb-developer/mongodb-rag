import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/mongodb-rag/blog',
    component: ComponentCreator('/mongodb-rag/blog', '12b'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/2025/02/01/simplifying',
    component: ComponentCreator('/mongodb-rag/blog/2025/02/01/simplifying', '0bb'),
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
    component: ComponentCreator('/mongodb-rag/blog/tags/mongodb', 'c08'),
    exact: true
  },
  {
    path: '/mongodb-rag/helloWorld',
    component: ComponentCreator('/mongodb-rag/helloWorld', '700'),
    exact: true
  },
  {
    path: '/mongodb-rag/docs',
    component: ComponentCreator('/mongodb-rag/docs', '357'),
    routes: [
      {
        path: '/mongodb-rag/docs',
        component: ComponentCreator('/mongodb-rag/docs', 'b8e'),
        routes: [
          {
            path: '/mongodb-rag/docs',
            component: ComponentCreator('/mongodb-rag/docs', '706'),
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
