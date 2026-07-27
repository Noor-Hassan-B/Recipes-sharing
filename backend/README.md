# backend/

This folder holds the pieces that were referenced by the app but missing,
plus a controllers layer. Nothing from `db/` or `routes/` was moved — they
stay exactly where they were.

```
backend/
├── controllers/        # Business logic, imported by the routes in ../routes
│   ├── userController.js
│   ├── recipeController.js
│   ├── categoryController.js
│   ├── commentController.js
│   ├── ratingController.js
│   ├── favoriteController.js
│   └── uploadController.js
├── middleware/
│   ├── errorMiddleware.js    # notFound (404) + global errorHandler
│   └── uploadMiddleware.js   # multer config (5MB limit, image types only)
├── routes/
│   └── upload.js             # POST /api/upload (protected, field name "image")
└── uploads/                  # Actual file storage for uploaded images
    ├── default-recipe.jpg    # Fallback used by Recipe model
    └── default-avatar.png    # Fallback used by User model
```

## What changed elsewhere (minimal wiring only)

- `server.js`:
  - `/uploads` static route now points at `backend/uploads` (previously pointed
    at a root-level `uploads/` folder that didn't exist).
  - Mounts the new upload route at `/upload` and `/api/upload`.
  - Adds `notFound` + `errorHandler` as the last two middlewares.
- `routes/*.js`: logic was extracted into `backend/controllers/*`, so each
  route file is now a thin router. Paths, methods, and behavior are unchanged.
- `package.json`: added `multer` as a dependency.

## Using the upload endpoint

```
POST /api/upload
Headers: Authorization: Bearer <token>
Body: multipart/form-data, field name "image"

Response: { success: true, url: "/uploads/<filename>", filename: "<filename>" }
```

Send the returned `url` as the `image` field when creating a recipe, or as
`profileImage` when updating a user.

Run `npm install` from the project root to pull in `multer` before starting
the server.
