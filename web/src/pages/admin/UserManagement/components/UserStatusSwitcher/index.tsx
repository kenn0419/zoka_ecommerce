import { Switch, message } from "antd";
import {
  useUserActiveQuery,
  useUserDeActiveQuery,
} from "../../../../../queries/user.query";

type Props = {
  user: IUserResponse;
};

export default function UserStatusSwitcher({ user }: Props) {
  const activeUser = useUserActiveQuery();
  const deActiveUser = useUserDeActiveQuery();

  const isActive = user.status === "ACTIVE";

  return (
    <Switch
      checked={isActive}
      loading={activeUser.isPending || deActiveUser.isPending}
      onChange={async (checked) => {
        console.log(user);
        try {
          checked
            ? await activeUser.mutateAsync(user.id)
            : await deActiveUser.mutateAsync(user.id);

          message.success("Status updated");
        } catch {
          message.error("Update status failed");
        }
      }}
    />
  );
}
