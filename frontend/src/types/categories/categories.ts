export interface Categories {
  id: string;
  name: string;
  description: string;
  show_online: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
  show_online: boolean;
}
