import type { TagDto, TagStatsDto } from "@/lib/constants/courses";
import { api } from "./api";

export async function getTags(): Promise<TagDto[]> {
  const res = await api.get<TagDto[]>("/tags");
  return res.data;
}

export async function getTagsWithStats(): Promise<TagStatsDto[]> {
  const res = await api.get<TagStatsDto[]>("/tags", {
    params: { withStats: true },
  });
  return res.data;
}

export async function createTag(name: string): Promise<TagDto> {
  const res = await api.post<TagDto>("/tags", { name });
  return res.data;
}

export async function updateTag(
  id: string,
  { name }: { name: string }
): Promise<TagDto> {
  const res = await api.patch<TagDto>(`/tags/${id}`, { name });
  return res.data;
}


export async function deleteTag(
  id: string,
): Promise<string> {
  const res = await api.delete<string>(`/tags/${id}`);
  return res.data;
}
