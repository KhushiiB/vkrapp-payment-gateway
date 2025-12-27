import Joi from 'joi';


export const createIntentValidation = {
  body: Joi.object({
    draft_id: Joi.number().required(),
    currency: Joi.string().required().min(3)
  }),
};
