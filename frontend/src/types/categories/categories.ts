export interface Categories {
  id: string;
  name: string;
  description: string;
  show_online: boolean | number;
  created_at?: string;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
  show_online: boolean | number;
}
