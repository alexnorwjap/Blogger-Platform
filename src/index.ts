import { setupApp } from './app';
import express from 'express';
import { runDB } from './db/mongo.db';
import { SETTINGS } from './shared/settings/settings';

const app = express();
setupApp(app);

const bootstrap = async () => {
  const PORT = SETTINGS.PORT;

  await runDB(SETTINGS.MONGO_URL);

  if (process.env.NODE_ENV !== 'production') {
    const port = PORT;
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }
  return app;
};

bootstrap();

export default app;
