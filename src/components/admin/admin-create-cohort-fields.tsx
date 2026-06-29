import { AdminField } from "@/components/admin/admin-field";
import { Input } from "@/components/ui/input";
import { formatDefaultCohortDescription, formatDefaultCohortName } from "@/lib/cohort";

export function AdminCreateCohortFields() {
  const defaultName = formatDefaultCohortName();
  const defaultDescription = formatDefaultCohortDescription();

  return (
    <>
      <AdminField label="Название потока">
        <Input name="name" defaultValue={defaultName} className="h-10 rounded-lg" required />
      </AdminField>
      <AdminField label="Описание">
        <Input name="description" defaultValue={defaultDescription} className="h-10 rounded-lg" required />
      </AdminField>
      <AdminField label="Статус">
        <select name="status" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm">
          <option value="RECRUITING">Набор</option>
          <option value="CURRENT">Текущий</option>
          <option value="COMPLETED">Завершен</option>
        </select>
      </AdminField>
      <AdminField label="Текущий день">
        <Input name="currentDayNumber" type="number" defaultValue={1} className="h-10 rounded-lg" />
      </AdminField>
    </>
  );
}
