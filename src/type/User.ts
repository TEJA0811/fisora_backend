// Re-export Prisma User type for compatibility while migrating away from
// handwritten interfaces. After `npx prisma generate`, `@prisma/client` will
// export the `User` type.
export type User = import('@prisma/client').User