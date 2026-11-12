
import { getDb } from '../db/connect.js';

// Retrieve all books
export const getAllBooks = async () => {
    const db = getDb();

    return await db
        .collection('books')
        .find({})
        .toArray();
};

// Retrieve one book by ID
export const getBookById = async (bookId) => {
    const db = getDb();

    return await db
        .collection('books')
        .findOne({ id: bookId });
};

// Create a new book
export const createBook = async (book) => {
    const db = getDb();

    await db.collection('books').insertOne(book);

    return book;
};

// Update an existing book
export const updateBook = async (bookId, book) => {
    const db = getDb();

    await db.collection('books').updateOne(
        { id: bookId },
        { $set: book }
    );

    return { id: bookId, ...book };
};

// Delete a book
export const deleteBook = async (bookId) => {
    const db = getDb();

    return await db
        .collection('books')
        .deleteOne({ id: bookId });
};

// Check whether an author exists
export const authorExists = async (authorId) => {
    const db = getDb();

    const author = await db
        .collection('authors')
        .findOne({ id: authorId });

    return Boolean(author);
};
