import { Collection, Db, MongoClient } from 'mongodb';
import { BlogEntity } from '../features/blog/db/entitiy';
import { PostEntity } from '../features/post/database/entity/entities';
import { User } from '../features/users/userTypes';
import { SETTINGS } from '../shared/settings/settings';

const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';
const USER_COLLECTION_NAME = 'users';

export let client: MongoClient;
export let blogCollection: Collection<BlogEntity>;
export let postCollection: Collection<PostEntity>;
export let userCollection: Collection<User>;

// Подключения к бд
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  //Инициализация коллекций
  blogCollection = db.collection<BlogEntity>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<PostEntity>(POST_COLLECTION_NAME);
  userCollection = db.collection<User>(USER_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
