
import express from 'express';
import { getDb } from './src/db/connect.js';

const app = express();

app.use(express.json());

// Root route
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Server is running'
    });
});

// GET all books
app.get('/books', async (req, res) => {
    try {
        const books = await getDb()
            .collection('books')
            .find({}, { projection: { _id: 0 } })
            .toArray();

        return res.status(200).json(books);

    } catch (error) {
        console.error('Error retrieving books:', error.message);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

// GET one book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await getDb()
            .collection('books')
            .findOne(
                { id: req.params.id },
                { projection: { _id: 0 } }
            );

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json(book);

    } catch (error) {
        console.error('Error retrieving book:', error.message);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

export default app;
