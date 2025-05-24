import Joi from "joi";

export const NewsValidator = Joi.object({
  id: Joi.string(),
  subtitle: Joi.string(),
  title: Joi.string(),
  category_id: Joi.any(),
  is_featured: Joi.boolean(),
  content: Joi.string(),
  summary: Joi.string(),
  number_of_clicks: Joi.number(),
  tags: Joi.string(),
  video: Joi.string(),
  image: Joi.string(),
  is_deleted: Joi.boolean(),
  expire_date: Joi.date(),
  is_active: Joi.boolean(),
  updated_by: Joi.string(),
  created_at: Joi.date(),
  updated_at: Joi.date(),
  created_by: Joi.string(),
  views: Joi.number(),
});

export const NewsConfigValidator = Joi.object({
  id: Joi.string(),
  show_featured: Joi.any(),
  show_most_watched: Joi.any(),
  show_related_news: Joi.any(),
  header_logo: Joi.string(),
  footer_logo: Joi.string(),
});
