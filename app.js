import express from 'express';
import router from './src/router.js';

const app = express();

app.use(express.json());

// Root route
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Server is running'
    });
});

// Register API routes
app.use(router);

export default app;