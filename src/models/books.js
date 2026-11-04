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