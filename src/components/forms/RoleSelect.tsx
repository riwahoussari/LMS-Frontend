import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES, type Role } from "@/lib/constants/users";

export function RoleSelect({
  role,
  setRole,
}: {
  role: Role | undefined;
  setRole: React.Dispatch<React.SetStateAction<Role | undefined>>;
}) {
  return (
    <div>
      <Label>
        <p className="opacity-80 ms-1 mb-1">Role</p>
      </Label>
      <Select value={role} onValueChange={(v) => setRole(v as Role)}>
        <SelectTrigger>
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(ROLES).map((k) => (
            <SelectItem key={k} value={ROLES[k] as Role}>
              {ROLES[k]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
