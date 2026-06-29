import { AdminField } from "@/components/admin/admin-field";
import { Input } from "@/components/ui/input";

export function AdminCreateCohortFields() {
  return (
    <>
      <AdminField label="Название потока">
        <Input name="name" className="h-10 rounded-lg" required />
      </AdminField>
      <AdminField label="Описание">
        <Input name="description" className="h-10 rounded-lg" required />
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
