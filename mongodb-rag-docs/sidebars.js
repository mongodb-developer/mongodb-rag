module.exports = {
  docs: [
    "intro",
    "installation",
    "usage",
    "cli-reference",
    {
      type: "category",
      label: "Examples",
      collapsed: false,
      items: [
        "examples/basic-example",
        "examples/advanced-example",
      ],
    },
    "create-rag-app",
    "api-reference",
    {
      type: "category",
      label: "Workshop",
      items: [
        {
          type: "category",
          label: "Introduction",
          items: [
            "workshop/Introduction/introduction",
            "workshop/Introduction/2-prerequisites"
          ]
        },
        {
          type: "category",
          label: "MongoDB Atlas",
          items: [
            "workshop/mongodb-atlas/1-what-is-mongodb",
            "workshop/mongodb-atlas/2-create-account",
            "workshop/mongodb-atlas/setup-mongodb"
          ]
        },
        {
          type: "category",
          label: "RAG Concepts",
          items: [
            "workshop/RAG-Concepts/rag-introduction",
            "workshop/RAG-Concepts/how-rag-works",
            "workshop/RAG-Concepts/rag-concepts",
            "workshop/RAG-Concepts/check-rag-knowledge"
          ]
        },
        {
          type: "category",
          label: "MongoDB RAG",
          items: [
            "workshop/MongoDB-RAG/introduction",
            "workshop/MongoDB-RAG/install-configure",
            "workshop/MongoDB-RAG/create-embeddings"
          ]
        },
        {
          type: "category",
          label: "Building the RAG App",
          items: [
            "workshop/build-rag-app/build-rag-app",
            "workshop/build-rag-app/2-ingest-documents",
            "workshop/build-rag-app/4-integrate-llm",
            "workshop/build-rag-app/5-cheat-script"
          ]
        },
        {
          type: "category",
          label: "Advanced Techniques",
          items: [
            "workshop/advanced-techniques/1-introduction",
            "workshop/advanced-techniques/2-hybrid-search",
            "workshop/advanced-techniques/3-metadata-filtering",
            "workshop/advanced-techniques/4-query-expansion"
          ]
        },
        {
          type: "category",
          label: "Production Deployment",
          items: [
            "workshop/production-deployment/production-deployment",
            "workshop/production-deployment/2-scaling",
            "workshop/production-deployment/3-monitoring",
            "workshop/production-deployment/4-cost-optimization"
          ]
        }
      ]
    }
  ],
};
