import type {
  UserDto,
  UserFiltersType,
  UpdateUserDto,
} from "@/lib/constants/users";
import type { PagedResult } from "@/lib/constants/others";
import { api } from "./api";

// read
export async function getUsers(
  filters: UserFiltersType
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

// update
export async function updateUser(data: UpdateUserDto): Promise<UserDto> {
  const res = await api.patch<UserDto>(`/users/me`, data);
  return res.data;
}

export async function toggleSuspendUser(userId: string, isSuspended: boolean) {
  const res = await api.patch<UserDto>(`/users/${userId}`, { isSuspended });
  return res.data;
}
