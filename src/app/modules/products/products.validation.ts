import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'), // Validate non-empty string
    price: z.number().min(0, 'Price must be a positive number'), // Ensure price is a positive number
    category: z.string({ required_error: 'Category is required' }),
    description: z.string().min(1, 'Description is required'), // Validate non-empty string
  }),
});

const updateProductSchema = z.object({
  body: createProductSchema.deepPartial(),
}); // Allow partial updates

export const productValidation = {
  createProductSchema,
  updateProductSchema,
};
