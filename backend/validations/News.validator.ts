import Joi from "joi";

export const NewsValidator = Joi.object({
  title: Joi.string(),
  category_id: Joi.any(),
  is_featured: Joi.boolean(),
  content: Joi.string(),
});

export const NewsConfigValidator = Joi.object({
  id: Joi.string(),
  show_featured: Joi.boolean(),
  show_most_watched: Joi.boolean(),
  show_related_news: Joi.boolean(),
});
