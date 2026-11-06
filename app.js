import express from 'express';
import router from './src/router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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