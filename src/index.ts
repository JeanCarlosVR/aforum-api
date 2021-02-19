import dotenv from 'dotenv';
import Server from './internal/middleware/Server';

((): boolean => {
    dotenv.config();
    new Server().listen();

    return true;
})();
