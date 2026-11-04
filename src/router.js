import express from 'express';
import {
    getBooksHandler,
    getBookByIdHandler
} from './controllers/books.js';

const router = express.Router();

// GET all books
router.get('/books', getBooksHandler);

// GET one book by ID
router.get('/books/:id', getBookByIdHandler);

export default router;