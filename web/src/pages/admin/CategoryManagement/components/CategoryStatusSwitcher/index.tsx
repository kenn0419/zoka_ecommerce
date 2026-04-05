import { Switch, message } from "antd";
import {
  useCategoryActivateQuery,
  useCategoryDeactivateQuery,
} from "../../../../../queries/category.query";

type Props = {
  category: ICategoryResponse;
};

export default function CategoryStatusSwitcher({ category }: Props) {
  const activateCategory = useCategoryActivateQuery();
  const deactivateCategory = useCategoryDeactivateQuery();

  const isActive = category.status === "ACTIVE";

  return (
    <Switch
      checked={isActive}
      loading={activateCategory.isPending || deactivateCategory.isPending}
      onChange={async (checked) => {
        try {
          checked
            ? await activateCategory.mutateAsync(category.slug)
            : await deactivateCategory.mutateAsync(category.slug);

          message.success("Category status updated");
        } catch {
          message.error("Update category status failed");
        }
      }}
    />
  );
}
