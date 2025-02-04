import { CollectionOptions, CreateIndexesOptions, type DbOptions, IndexSpecification, MongoClient, type MongoClientOptions } from 'mongodb';

export const createMongoClient = (url: string, options: MongoClientOptions) => {
  const client = new MongoClient(url, options);

  const createDb = (dbName: string, options: DbOptions) => {
    const db = client.db(dbName, options);

    const createCollection = (name: string, options: CollectionOptions) => {
      const collection = db.collection(name, options);

      return {
        createIndex: (indexSpec: IndexSpecification, options: CreateIndexesOptions) => collection.createIndex(indexSpec, options),
      };
    };

    return {
      collection: createCollection,
    };
  };

  return {
    connect: () => client.connect(),
    db: createDb,
  };
};

export type { WithId } from 'mongodb';
