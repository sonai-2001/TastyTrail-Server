# Express Production Boilerplate (TypeScript) with Swagger tags grouping

Features:
- TypeScript + strict config
- Segregated routes (user/admin) and sub-features (auth, products)
- Controllers split into user/ and admin/
- Services split: shared/, user/, admin/ (shared db utilities)
- Swagger docs in `docs/swagger.yaml` with tags: User - Auth, User - Products, Admin - Auth, Admin - Product Management, etc.
- Graceful shutdown (SIGINT/SIGTERM)
- Husky pre-commit hook runs `tsc --noEmit` and `eslint` to block commits on TS errors

How to run:
1. Copy `.env.example` to `.env` and configure.
2. `npm install`
3. `npm run dev` for development
4. `npm run build` && `npm start` for production

Swagger UI is available at `http://localhost:4000/docs` when the server is running.
