import { app } from './app';
const PORT = process.env.PORT || 5005;

if (process.env.NODE_ENV !== 'production') {
  const port = PORT;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export default app;
