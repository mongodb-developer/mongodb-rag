import React, { useState } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import "./RAGConceptsDiagram.css"; // Ensure styles are properly loaded

const steps = [
  {
    id: 1,
    title: "User Query",
    description: "The user submits a question, such as 'How does MongoDB Atlas Vector Search work?'",
    code: `const query = "How does MongoDB Atlas Vector Search work?";`
  },
  {
    id: 2,
    title: "Vector Search",
    description: "The system retrieves relevant documents using vector search.",
    code: `const searchResults = await collection.aggregate([
      { $vectorSearch: { queryVector: embedding, path: 'embedding', numCandidates: 100, limit: 10 } }
    ]);`
  },
  {
    id: 3,
    title: "Augmentation",
    description: "Retrieved documents are injected into the LLM prompt.",
    code: `const augmentedPrompt = \`Context: \{retrievedDocs}\\n\\nQuestion: \{query}\`;`
  },
  {
    id: 4,
    title: "LLM Response",
    description: "The LLM generates an answer based on the augmented prompt.",
    code: `const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'Answer based on the provided context only.' },
                 { role: 'user', content: augmentedPrompt }]
    });`
  }
];

export default function RAGConceptsDiagram() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentStep = steps[currentStepIndex];

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="rag-container">
      <h2 className="rag-title">How RAG Works</h2>
      <motion.div
        key={currentStep.id}
        className="rag-step"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        <span className="rag-step-number">{currentStep.id}</span>
        <div className="rag-step-content">
          <h3 className="rag-step-title">{currentStep.title}</h3>
          <p className="rag-step-description">{currentStep.description}</p>
          <button className="rag-code-button" onClick={() => setIsModalOpen(true)}>View Code</button>
        </div>
      </motion.div>

      <div className="rag-nav-buttons">
        <button className="rag-nav-button" onClick={prevStep} disabled={currentStepIndex === 0}>
          ◀ Previous
        </button>
        <button className="rag-nav-button" onClick={nextStep} disabled={currentStepIndex === steps.length - 1}>
          Next ▶
        </button>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Code Example"
          className="rag-modal"
          overlayClassName="rag-modal-overlay"
        >
          <h2 className="rag-modal-title">{currentStep.title} - Code Example</h2>
          <pre className="rag-code-block">
            <code>{currentStep.code}</code>
          </pre>
          <button className="rag-close-button" onClick={() => setIsModalOpen(false)}>Close</button>
        </Modal>
      )}
    </div>
  );
}
