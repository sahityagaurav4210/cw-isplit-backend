import mongoose, { Mongoose } from 'mongoose';

class DatabaseManager {
  private static instance: Mongoose;

  private constructor() {}

  public static async initialize(): Promise<void> {
    if (!DatabaseManager.instance) {
      const dbUri = process.env.MONGO_URL;
      const dbName = process.env.NODE_ENV === 'local' ? 'isplit-local' : 'isplit';

      if (!dbUri) {
        throw new Error('Database url is not defined');
      }

      DatabaseManager.instance = await mongoose.connect(dbUri, { dbName, connectTimeoutMS: 5000 });
    }
  }

  public static async getInstance(): Promise<Mongoose> {
    if (!DatabaseManager.instance) {
      await DatabaseManager.initialize();
    }

    return DatabaseManager.instance;
  }
}

export default DatabaseManager;
