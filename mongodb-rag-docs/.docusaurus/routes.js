import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/mongodb-rag/blog',
    component: ComponentCreator('/mongodb-rag/blog', '9d8'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/2025/02/01/simplifying',
    component: ComponentCreator('/mongodb-rag/blog/2025/02/01/simplifying', '0bb'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/2025/02/22/building-the-docs-chatbot',
    component: ComponentCreator('/mongodb-rag/blog/2025/02/22/building-the-docs-chatbot', '3d8'),
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
    component: ComponentCreator('/mongodb-rag/blog/tags/ai', 'f0c'),
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
    component: ComponentCreator('/mongodb-rag/blog/tags/mongodb', 'b22'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/rag',
    component: ComponentCreator('/mongodb-rag/blog/tags/rag', '2eb'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/tutorial',
    component: ComponentCreator('/mongodb-rag/blog/tags/tutorial', 'fc9'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/vector-search',
    component: ComponentCreator('/mongodb-rag/blog/tags/vector-search', '2ac'),
    exact: true
  },
  {
    path: '/mongodb-rag/blog/tags/workshop',
    component: ComponentCreator('/mongodb-rag/blog/tags/workshop', 'd8b'),
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
    component: ComponentCreator('/mongodb-rag/docs', '5ba'),
    routes: [
      {
        path: '/mongodb-rag/docs',
        component: ComponentCreator('/mongodb-rag/docs', '9a5'),
        routes: [
          {
            path: '/mongodb-rag/docs',
            component: ComponentCreator('/mongodb-rag/docs', 'a74'),
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
                path: '/mongodb-rag/docs/workshop/advanced-techniques/1-introduction',
                component: ComponentCreator('/mongodb-rag/docs/workshop/advanced-techniques/1-introduction', '7c4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/advanced-techniques/2-hybrid-search',
                component: ComponentCreator('/mongodb-rag/docs/workshop/advanced-techniques/2-hybrid-search', 'c94'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/advanced-techniques/3-metadata-filtering',
                component: ComponentCreator('/mongodb-rag/docs/workshop/advanced-techniques/3-metadata-filtering', '1f1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/advanced-techniques/4-query-expansion',
                component: ComponentCreator('/mongodb-rag/docs/workshop/advanced-techniques/4-query-expansion', '217'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/build-rag-app/2-ingest-documents',
                component: ComponentCreator('/mongodb-rag/docs/workshop/build-rag-app/2-ingest-documents', '660'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/build-rag-app/4-integrate-llm',
                component: ComponentCreator('/mongodb-rag/docs/workshop/build-rag-app/4-integrate-llm', '6ac'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/build-rag-app/5-cheat-script',
                component: ComponentCreator('/mongodb-rag/docs/workshop/build-rag-app/5-cheat-script', '10c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/build-rag-app/advanced-techniques',
                component: ComponentCreator('/mongodb-rag/docs/workshop/build-rag-app/advanced-techniques', 'b21'),
                exact: true
              },
              {
                path: '/mongodb-rag/docs/workshop/build-rag-app/build-rag-app',
                component: ComponentCreator('/mongodb-rag/docs/workshop/build-rag-app/build-rag-app', '78c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/Introduction/2-prerequisites',
                component: ComponentCreator('/mongodb-rag/docs/workshop/Introduction/2-prerequisites', '507'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/Introduction/introduction',
                component: ComponentCreator('/mongodb-rag/docs/workshop/Introduction/introduction', '149'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/mongodb-atlas/1-what-is-mongodb',
                component: ComponentCreator('/mongodb-rag/docs/workshop/mongodb-atlas/1-what-is-mongodb', '4bd'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/mongodb-atlas/2-create-account',
                component: ComponentCreator('/mongodb-rag/docs/workshop/mongodb-atlas/2-create-account', '0cb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/mongodb-atlas/setup-mongodb',
                component: ComponentCreator('/mongodb-rag/docs/workshop/mongodb-atlas/setup-mongodb', '08c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/MongoDB-RAG/create-embeddings',
                component: ComponentCreator('/mongodb-rag/docs/workshop/MongoDB-RAG/create-embeddings', '1b8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/MongoDB-RAG/install-configure',
                component: ComponentCreator('/mongodb-rag/docs/workshop/MongoDB-RAG/install-configure', 'da3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/MongoDB-RAG/introduction',
                component: ComponentCreator('/mongodb-rag/docs/workshop/MongoDB-RAG/introduction', '7c3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/production-deployment/2-scaling',
                component: ComponentCreator('/mongodb-rag/docs/workshop/production-deployment/2-scaling', 'e9e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/production-deployment/3-monitoring',
                component: ComponentCreator('/mongodb-rag/docs/workshop/production-deployment/3-monitoring', '592'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/production-deployment/4-cost-optimization',
                component: ComponentCreator('/mongodb-rag/docs/workshop/production-deployment/4-cost-optimization', 'e47'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/production-deployment/production-deployment',
                component: ComponentCreator('/mongodb-rag/docs/workshop/production-deployment/production-deployment', 'be0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/RAG-Concepts/check-rag-knowledge',
                component: ComponentCreator('/mongodb-rag/docs/workshop/RAG-Concepts/check-rag-knowledge', '95b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/RAG-Concepts/how-rag-works',
                component: ComponentCreator('/mongodb-rag/docs/workshop/RAG-Concepts/how-rag-works', '4a3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/mongodb-rag/docs/workshop/RAG-Concepts/rag-concepts',
                component: ComponentCreator('/mongodb-rag/docs/workshop/RAG-Concepts/rag-concepts', '77a'),
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
