// bin/utils/index-utils.js
import Enquirer from 'enquirer';

const isNonInteractive = process.env.NONINTERACTIVE === 'true';

export function getIndexDefinition(config, indexParams = null) {
  const params = indexParams || {
    indexName: config.indexName || 'vector_index',
    path: config.embedding?.path || 'embedding',
    numDimensions: config.embedding?.dimensions || 1536,
    similarity: config.embedding?.similarity || 'cosine'
  };

  return {
    name: params.indexName,
    type: 'vectorSearch',
    definition: {
      fields: [{
        type: 'vector',
        path: params.path,
        numDimensions: params.numDimensions,
        similarity: params.similarity
      }]
    }
  };
}

export async function getIndexParams(config, options = {}) {
  if (isNonInteractive || options.nonInteractive) {
    return {
      indexName: process.env.VECTOR_INDEX || config.indexName || 'vector_index',
      path: process.env.FIELD_PATH || config.embedding?.path || 'embedding',
      numDimensions: Number(process.env.NUM_DIMENSIONS) || config.embedding?.dimensions || 1536,
      similarity: process.env.SIMILARITY_FUNCTION || config.embedding?.similarity || 'cosine'
    };
  }

  const enquirer = new Enquirer();
  const responses = await enquirer.prompt([
    {
      type: 'input',
      name: 'indexName',
      message: 'Enter the name for your Vector Search Index:',
      initial: config.indexName || 'vector_index'
    },
    {
      type: 'input',
      name: 'path',
      message: 'Enter the field path where vector embeddings are stored:',
      initial: config.embedding?.path || 'embedding'
    },
    {
      type: 'input',
      name: 'numDimensions',
      message: 'Enter the number of dimensions for embeddings:',
      initial: String(config.embedding?.dimensions || '1536'),
      validate: input => !isNaN(input) && Number(input) > 0 ? true : 'Please enter a valid number'
    },
    {
      type: 'select',
      name: 'similarity',
      message: 'Choose the similarity function:',
      choices: ['cosine', 'dotProduct', 'euclidean'],
      initial: config.embedding?.similarity || 'cosine'
    }
  ]);

  return {
    ...responses,
    numDimensions: Number(responses.numDimensions)
  };
}