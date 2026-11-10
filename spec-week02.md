# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

TODO: Follow the example above to complete a spec for the authors feature.




## Feature 2: Author CRUD Operations

### Goal
Create an authors API that supports all CRUD operations. Author documents will be stored in a separate MongoDB collection. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors will use custom string IDs instead of MongoDB `_id` values for route parameters.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by their custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a3",
      "name": "Jane Austen",
      "birthYear": 1775
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing or invalid
- `400` if the author id already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

    {
      "name": "Jane Austen",
      "birthYear": 1775
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing or invalid
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has books referencing their id
- `500` if an unexpected server or database error occurs

### Relationship to Books
Each author can be referenced by multiple books through the book's `authorId` field.

Before deleting an author, the API must check whether any books reference that author's custom id.

If books still reference the author, the API must reject the deletion with a `409` status code and a JSON error response explaining that the author cannot be deleted while books reference them.

If no books reference the author, the API can delete the author and return `204` with no response body.

### Swagger Documentation
Swagger must document every author route, including:
- HTTP method and endpoint path
- Path parameters where applicable
- Required request body fields for POST and PUT
- Successful response codes and response bodies
- Error response codes and descriptions

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.




# Evaluation of Version 1

## 1. Bugs and Short-Sighted Decisions
- PUT requests must require all editable fields because PUT represents a full update.
- Book publication dates must follow the YYYY-MM-DD format.
- Author birth years must be valid integers within a reasonable range.
- Custom IDs must be unique within their respective collections.
- The author deletion error response must be clearly defined.

## 2. Security Considerations
- Validate all incoming request data before database operations.
- Reject missing, empty, or incorrectly typed fields.
- Do not allow clients to modify MongoDB internal _id values.
- Prevent unsafe MongoDB queries using untrusted client input.
- Return safe error messages without exposing database details or stack traces.
- Handle malformed JSON requests appropriately.

## 3. Efficiency Concerns
- Consider pagination for GET all books and GET all authors.
- Create indexes on custom id fields.
- Create an index on books.authorId to improve author-reference queries.
- Validate request data before performing database operations.
- Check author references efficiently before creating or updating books.

## 4. Unclear Responses and Error Behaviors
- Use consistent JSON structures for error responses.
- Define error responses for duplicate IDs and invalid author references.
- Define the response when deleting an author who still has books.
- Ensure 204 No Content responses contain no response body.
- Return 404 when attempting to update or delete nonexistent records.
- Document request bodies, response bodies, and error responses in Swagger.




# Books API Week 02 Spec - Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Extend the existing Week 01 Books API to support all CRUD operations. Each book must reference an existing author through the author's custom ID. All book routes must be documented and testable through Swagger UI.

### Data Model

Book documents will be stored in the `books` collection.

Required fields:
- `id`: string, required, unique custom ID such as `b1`
- `authorId`: string, required, references an existing author's custom `id`
- `title`: string, required, non-empty
- `publicationDate`: string, required, valid date in `YYYY-MM-DD` format

MongoDB `_id` will remain internal and will not be accepted as a client-editable field.

### Relationship to Authors
- Each book must reference an existing author using `authorId`.
- One author can have multiple books.
- The API must verify that the referenced author exists before creating or updating a book.
- If the author does not exist, return `400 Bad Request`.
- Books must not contain the author's name as a substitute for `authorId`.

### Validation and Error Responses
- All required fields must be present.
- String fields must not be empty or contain only whitespace.
- `publicationDate` must be a valid calendar date in `YYYY-MM-DD` format.
- Custom book IDs must be unique.
- Duplicate IDs return `400 Bad Request`.
- Invalid author references return `400 Bad Request`.
- Invalid request data returns a JSON error response:

      {
        "message": "Invalid request data"
      }

- Unexpected database or server errors return `500 Internal Server Error` without exposing internal details.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- `200 OK`
- Response body: array of book objects.

Errors:
- `500 Internal Server Error` if an unexpected error occurs.

#### GET /books/:id
Purpose: Return one book using its custom ID.

Success:
- `200 OK`
- Response body: matching book object.

Errors:
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- `201 Created`
- Response body: newly created book object.

Errors:
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if the custom book ID already exists.
- `400 Bad Request` if the author ID does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

#### PUT /books/:id
Purpose: Fully update an existing book using its custom ID.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- `200 OK`
- Response body: updated book object.

Errors:
- `400 Bad Request` if any required editable field is missing or invalid.
- `400 Bad Request` if the referenced author does not exist.
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

The custom book ID is supplied through the URL and cannot be changed through the request body.

#### DELETE /books/:id
Purpose: Delete an existing book using its custom ID.

Success:
- `204 No Content`
- No response body.

Errors:
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

### Database Efficiency
- Create a unique index on the `id` field in the books collection.
- Create an index on `authorId` to improve author-reference queries.
- Pagination may be introduced in a future improvement if the collection becomes large.

### Swagger Documentation
Document every book route using OpenAPI 3 syntax.

Documentation must include:
- HTTP method and endpoint path.
- Path parameters.
- Request body schemas and examples.
- Successful response codes and response schemas.
- Error response codes and JSON examples.

Swagger UI must allow all book routes to be tested from `/api-docs`.

### Deployment Expectations
All book routes must work locally and on the deployed Render application. The deployed Swagger documentation must allow users to test all book operations.

---

## Feature 2: Author CRUD Operations

### Goal
Create an authors API that supports all CRUD operations. Authors will be stored in a separate MongoDB collection and referenced by books through their custom IDs. Every author route must be documented and testable through Swagger UI.

### Data Model

Author documents will be stored in the `authors` collection.

Required fields:
- `id`: string, required, unique custom ID such as `a1`
- `name`: string, required, non-empty
- `birthYear`: number, required, integer between 1 and the current calendar year.

MongoDB `_id` will remain internal and will not be accepted as a client-editable field.

### Relationship to Books
- Each author can be referenced by multiple books.
- Books reference authors through the `authorId` field.
- The value of `books.authorId` must match `authors.id`.
- Before deleting an author, the API must check whether books reference that author's ID.
- If books still reference the author, reject the deletion with `409 Conflict`.
- If no books reference the author, allow deletion with `204 No Content`.

### Validation and Error Responses
- All required fields must be present.
- Author names must not be empty or contain only whitespace.
- Birth years must be integers between 1 and the current calendar year.
- Author IDs must be unique.
- Duplicate author IDs return `400 Bad Request`.
- Invalid request data returns `400 Bad Request` with a JSON error response:

      {
        "message": "Invalid request data"
      }

- Missing authors return `404 Not Found`.
- Authors with existing books cannot be deleted and return `409 Conflict`.
- Unexpected errors return `500 Internal Server Error` without exposing internal details.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- `200 OK`
- Response body: array of author objects.

Errors:
- `500 Internal Server Error` if an unexpected error occurs.

#### GET /authors/:id
Purpose: Return one author using their custom ID.

Success:
- `200 OK`
- Response body: matching author object.

Errors:
- `404 Not Found` if the author does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a3",
      "name": "Jane Austen",
      "birthYear": 1775
    }

Success:
- `201 Created`
- Response body: newly created author object.

Errors:
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if the custom author ID already exists.
- `500 Internal Server Error` if an unexpected error occurs.

#### PUT /authors/:id
Purpose: Fully update an existing author using their custom ID.

Request body:

    {
      "name": "Jane Austen",
      "birthYear": 1775
    }

Success:
- `200 OK`
- Response body: updated author object.

Errors:
- `400 Bad Request` if any required editable field is missing or invalid.
- `404 Not Found` if the author does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

The custom author ID is supplied through the URL and cannot be changed through the request body.

#### DELETE /authors/:id
Purpose: Delete an existing author using their custom ID.

Success:
- `204 No Content`
- No response body.

Errors:
- `404 Not Found` if the author does not exist.
- `409 Conflict` if one or more books still reference the author.

Conflict response example:

    {
      "message": "Cannot delete author because books still reference this author"
    }

- `500 Internal Server Error` if an unexpected error occurs.

### Database Efficiency
- Create a unique index on the `id` field in the authors collection.
- Use the `books.authorId` index when checking whether an author is referenced by books.
- Validate request data before performing database writes.

### Swagger Documentation
Document every author route using OpenAPI 3 syntax.

Documentation must include:
- HTTP method and endpoint path.
- Path parameters.
- Request body schemas and examples.
- Successful response codes and response schemas.
- Error response codes and JSON examples.

Swagger UI must allow all author routes to be tested from `/api-docs`.

### Deployment Expectations
All author routes must work locally and on the deployed Render application. The deployed Swagger documentation must allow users to test all author operations.




