import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/mongodb-rag/__docusaurus/debug',
    component: ComponentCreator('/mongodb-rag/__docusaurus/debug', 'a84'),
    exact: true
  },
  {
    path: '/mongodb-rag/__docusaurus/debug/config',
    component: ComponentCreator('/mongodb-rag/__docusaurus/debug/config', '9c2'),
    exact: true
  },
  {
    path: '/mongodb-rag/__docusaurus/debug/content',
    component: ComponentCreator('/mongodb-rag/__docusaurus/debug/content', '6c6'),
    exact: true
  },
  {
    path: '/mongodb-rag/__docusaurus/debug/globalData',
    component: ComponentCreator('/mongodb-rag/__docusaurus/debug/globalData', 'b22'),
    exact: true
  },
  {
    path: '/mongodb-rag/__docusaurus/debug/metadata',
    component: ComponentCreator('/mongodb-rag/__docusaurus/debug/metadata', '8db'),
    exact: true
  },
  {
    path: '/mongodb-rag/__docusaurus/debug/registry',
    component: ComponentCreator('/mongodb-rag/__docusaurus/debug/registry', '534'),
    exact: true
  },
  {
    path: '/mongodb-rag/__docusaurus/debug/routes',
    component: ComponentCreator('/mongodb-rag/__docusaurus/debug/routes', 'ca6'),
    exact: true
  },
  {
    path: '/mongodb-rag/helloWorld',
    component: ComponentCreator('/mongodb-rag/helloWorld', '700'),
    exact: true
  },
  {
    path: '/mongodb-rag/docs',
    component: ComponentCreator('/mongodb-rag/docs', 'edf'),
    routes: [
      {
        path: '/mongodb-rag/docs',
        component: ComponentCreator('/mongodb-rag/docs', '4da'),
        routes: [
          {
            path: '/mongodb-rag/docs',
            component: ComponentCreator('/mongodb-rag/docs', '569'),
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
