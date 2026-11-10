
import {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    authorHasBooks
} from '../models/authors.js';

// Validate author input
const isValidAuthor = (name, birthYear) => {
    const currentYear = new Date().getFullYear();

    return (
        typeof name === 'string' &&
        name.trim().length > 0 &&
        Number.isInteger(birthYear) &&
        birthYear >= 1 &&
        birthYear <= currentYear
    );
};

// GET /authors
export const getAllAuthorsHandler = async (req, res) => {
    try {
        const authors = await getAllAuthors();
        return res.status(200).json(authors);
    } catch (error) {
        console.error('Error retrieving authors:', error.message);

        return res.status(500).json({
            message: 'Unable to retrieve authors.'
        });
    }
};

// GET /authors/:id
export const getAuthorByIdHandler = async (req, res) => {
    try {
        const author = await getAuthorById(req.params.id);

        if (!author) {
            return res.status(404).json({
                message: 'Author not found.'
            });
        }

        return res.status(200).json(author);
    } catch (error) {
        console.error('Error retrieving author:', error.message);

        return res.status(500).json({
            message: 'Unable to retrieve author.'
        });
    }
};

// POST /authors
export const createAuthorHandler = async (req, res) => {
    try {
        const { id, name, birthYear } = req.body;

        if (
            typeof id !== 'string' ||
            id.trim().length === 0 ||
            !isValidAuthor(name, birthYear)
        ) {
            return res.status(400).json({
                message: 'Invalid author data. Provide a valid id, name, and birthYear.'
            });
        }

        const existingAuthor = await getAuthorById(id.trim());

        if (existingAuthor) {
            return res.status(400).json({
                message: 'An author with this ID already exists.'
            });
        }

        const author = await createAuthor({
            id: id.trim(),
            name: name.trim(),
            birthYear
        });

        return res.status(201).json(author);
    } catch (error) {
        console.error('Error creating author:', error.message);

        return res.status(500).json({
            message: 'Unable to create author.'
        });
    }
};

// PUT /authors/:id
export const updateAuthorHandler = async (req, res) => {
    try {
        const { name, birthYear } = req.body;

        if (!isValidAuthor(name, birthYear)) {
            return res.status(400).json({
                message: 'Invalid author data. Provide a valid name and birthYear.'
            });
        }

        const id = req.params.id;
        const existingAuthor = await getAuthorById(id);

        if (!existingAuthor) {
            return res.status(404).json({
                message: 'Author not found.'
            });
        }

        const author = await updateAuthor(id, {
            name: name.trim(),
            birthYear
        });

        return res.status(200).json(author);
    } catch (error) {
        console.error('Error updating author:', error.message);

        return res.status(500).json({
            message: 'Unable to update author.'
        });
    }
};

// DELETE /authors/:id
export const deleteAuthorHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const existingAuthor = await getAuthorById(id);

        if (!existingAuthor) {
            return res.status(404).json({
                message: 'Author not found.'
            });
        }

        const hasBooks = await authorHasBooks(id);

        if (hasBooks) {
            return res.status(409).json({
                message: 'Cannot delete author because books still reference this author'
            });
        }

        await deleteAuthor(id);

        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting author:', error.message);

        return res.status(500).json({
            message: 'Unable to delete author.'
        });
    }
};
