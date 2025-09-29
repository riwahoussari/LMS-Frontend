import type { CategoryDto, CategoryStatsDto } from "@/lib/constants";
import { api } from "./api";

export async function getCategories(): Promise<CategoryDto[]> {
  const res = await api.get<CategoryDto[]>("/categories");
  return res.data;
}

export async function getCategoriesWithStats(): Promise<CategoryStatsDto[]> {
  const res = await api.get<CategoryStatsDto[]>("/categories", {
    params: { withStats: true },
  });
  return res.data;
}

export async function createCategory(name: string): Promise<CategoryDto> {
  const res = await api.post<CategoryDto>("/categories", { name });
  return res.data;
}

export async function updateCategory(
  id: string,
  { name }: { name: string }
): Promise<CategoryDto> {
  const res = await api.patch<CategoryDto>(`/categories/${id}`, { name });
  return res.data;
}


export async function deleteCategory(
  id: string,
): Promise<string> {
  const res = await api.delete<string>(`/categories/${id}`);
  return res.data;
}
