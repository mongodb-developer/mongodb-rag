export const mockCollection = {
    createSearchIndexes: () => {
      console.log("✅ Mocked `createSearchIndexes()` called.");
      return Promise.resolve([{ name: 'vector_index' }]);
    },
    listSearchIndexes: () => {
      console.log("✅ Mocked `listSearchIndexes()` called.");
      return { toArray: async () => [] };
    },
    aggregate: () => ({ toArray: async () => [] }),
    indexes: async () => [],
    dropSearchIndex: async () => true
  };
  
  export const mockClient = {
    connect: async () => {},
    db: () => ({
      collection: () => mockCollection
    }),
    close: async () => {}
  };