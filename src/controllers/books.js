
import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    authorExists
} from '../models/books.js';

// Validate book input
const isValidBook = (authorId, title, publicationDate) => {
    if (
        typeof authorId !== 'string' ||
        authorId.trim().length === 0 ||
        typeof title !== 'string' ||
        title.trim().length === 0 ||
        typeof publicationDate !== 'string'
    ) {
        return false;
    }

    // Require YYYY-MM-DD format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(publicationDate)) {
        return false;
    }

    // Check that the date is a real calendar date
    const date = new Date(`${publicationDate}T00:00:00.000Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === publicationDate
    );
};

// Handle GET /books
export const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('Error retrieving books:', error.message);

        return res.status(500).json({
            message: 'Unable to retrieve books.'
        });
    }
};

// Handle GET /books/:id
export const getBookByIdHandler = async (req, res) => {
    try {
        const book = await getBookById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('Error retrieving book:', error.message);

        return res.status(500).json({
            message: 'Unable to retrieve book.'
        });
    }
};

// Handle POST /books
export const createBookHandler = async (req, res) => {
    try {
        const { id, authorId, title, publicationDate } = req.body;

        if (
            typeof id !== 'string' ||
            id.trim().length === 0 ||
            !isValidBook(authorId, title, publicationDate)
        ) {
            return res.status(400).json({
                message: 'Invalid book data. Provide a valid id, authorId, title, and publicationDate.'
            });
        }

        const existingBook = await getBookById(id.trim());

        if (existingBook) {
            return res.status(400).json({
                message: 'A book with this ID already exists.'
            });
        }

        const exists = await authorExists(authorId.trim());

        if (!exists) {
            return res.status(400).json({
                message: 'The specified author does not exist.'
            });
        }

        const book = await createBook({
            id: id.trim(),
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate
        });

        return res.status(201).json(book);
    } catch (error) {
        console.error('Error creating book:', error.message);

        return res.status(500).json({
            message: 'Unable to create book.'
        });
    }
};

// Handle PUT /books/:id
export const updateBookHandler = async (req, res) => {
    try {
        const { authorId, title, publicationDate } = req.body;

        if (!isValidBook(authorId, title, publicationDate)) {
            return res.status(400).json({
                message: 'Invalid book data. Provide a valid authorId, title, and publicationDate.'
            });
        }

        const exists = await authorExists(authorId.trim());

        if (!exists) {
            return res.status(400).json({
                message: 'The specified author does not exist.'
            });
        }

        const id = req.params.id;
        const existingBook = await getBookById(id);

        if (!existingBook) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        const book = await updateBook(id, {
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate
        });

        return res.status(200).json(book);
    } catch (error) {
        console.error('Error updating book:', error.message);

        return res.status(500).json({
            message: 'Unable to update book.'
        });
    }
};

// Handle DELETE /books/:id
export const deleteBookHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const existingBook = await getBookById(id);

        if (!existingBook) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        await deleteBook(id);

        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting book:', error.message);

        return res.status(500).json({
            message: 'Unable to delete book.'
        });
    }
};
