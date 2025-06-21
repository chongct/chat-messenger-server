import express from 'express';
import bodyParser from 'body-parser';

import routes from './routes';

const app = express();

const PORT = process.env.PORT || 3001;

app.use(bodyParser.urlencoded());
app.use('/', routes);
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
