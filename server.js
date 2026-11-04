import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

import app from './app.js';
import { connectToDb } from './src/db/connect.js';

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await connectToDb();

        app.listen(PORT, () => {
            console.log(`Server listening at 127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to database:', error.message);
        process.exit(1);
    }
};

startServer();