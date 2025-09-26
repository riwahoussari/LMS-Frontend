import type { UserDto, PagedResult, UserFitlersType } from "@/lib/constants";
import { api } from "./api";

export async function getUsers(
  filters: UserFitlersType
): Promise<PagedResult<UserDto>> {
  const res = await api.get<PagedResult<UserDto>>("/users", {
    params: filters,
    paramsSerializer: { indexes: null },
  });

  return res.data;
}

export async function getUser(id: string) {
  const res = await api.get<UserDto>(`/users/${id}`);

  return res.data;
}
