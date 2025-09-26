import type { TagDto } from "@/lib/constants";
import { api } from "./api";

export async function getTags(): Promise<TagDto[]> {
  const res = await api.get<TagDto[]>("/tags");
  return res.data;
}
