import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const errorDetails = err.details?.map((detail) => detail.message) || [
      'Invalid data',
    ];

    const error = createHttpError(400, 'Bad request', {
      errors: errorDetails,
    });

    next(error);
  }
};


