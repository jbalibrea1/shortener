import app from './app';
import config from './config/server';
import logger from './utils/logger';

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
