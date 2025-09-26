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
