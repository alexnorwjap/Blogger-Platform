export const SETTINGS = {
  PORT: process.env.PORT || 5005,
  MONGO_URL:
    process.env.MONGO_URL ||
    'mongodb+srv://alexnorwjap_db_user:BVm0JNcHgqbKpI7W@mongodb.sqk15l0.mongodb.net/?retryWrites=true&w=majority&appName=MongoDB',
  DB_NAME: process.env.DB_NAME || 'blogger-platform',
};
