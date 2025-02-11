import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Fast Vector Search',
    description: (
      <>
        Built on MongoDB Atlas Vector Search for efficient similarity-based queries
      </>
    ),
  },
  {
    title: 'OpenAI Integration',
    description: (
      <>
        Seamless integration with OpenAI embeddings for advanced text processing
      </>
    ),
  },
  {
    title: 'Easy to Use',
    description: (
      <>
        Simple API designed to get you up and running quickly with RAG applications
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}