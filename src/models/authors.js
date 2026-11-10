
import { getDb } from '../db/connect.js';

// Get all authors
const getAllAuthors = async () => {
    const db = getDb();
    const collection = db.collection('authors');

    return await collection.find({}).toArray();
};

// Get one author by custom ID
const getAuthorById = async (id) => {
    const db = getDb();
    const collection = db.collection('authors');

    return await collection.findOne({ id });
};

// Create a new author
const createAuthor = async (author) => {
    const db = getDb();
    const collection = db.collection('authors');

    await collection.insertOne(author);

    return author;
};

// Update an existing author
const updateAuthor = async (id, author) => {
    const db = getDb();
    const collection = db.collection('authors');

    await collection.updateOne(
        { id },
        { $set: author }
    );

    return { id, ...author };
};

// Delete an author
const deleteAuthor = async (id) => {
    const db = getDb();
    const collection = db.collection('authors');

    return await collection.deleteOne({ id });
};

// Check whether an author has books
const authorHasBooks = async (id) => {
    const db = getDb();
    const collection = db.collection('books');

    const count = await collection.countDocuments({
        authorId: id
    });

    return count > 0;
};

export {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    authorHasBooks
};
