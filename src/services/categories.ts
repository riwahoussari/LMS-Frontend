import type { CategoryDto } from "@/lib/constants";
import { api } from "./api";

export async function getCategories(): Promise<CategoryDto[]> {
  const res = await api.get<CategoryDto[]>("/categories");
  return res.data;
}
