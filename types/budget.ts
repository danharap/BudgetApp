export interface CategoryBudget {
  categoryId: string;
  limit: number;
}

export interface Budget {
  id: string;
  monthKey: string; // "2026-04"
  totalLimit: number;
  categories: CategoryBudget[];
  createdAt: string;
}
