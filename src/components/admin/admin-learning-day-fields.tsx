import { AdminField } from "@/components/admin/admin-field";
import { Input } from "@/components/ui/input";

type DayValues = {
  dayNumber?: number;
  slug?: string;
  title?: string;
  date?: string;
  startAt?: string;
  meetingLink?: string;
  description?: string;
  agenda?: string;
  isCompleted?: boolean;
};

export function AdminLearningDayFields({ values }: { values?: DayValues }) {
  return (
    <>
      <AdminField label="№ дня">
        <Input
          name="dayNumber"
          type="number"
          defaultValue={values?.dayNumber}
          className="h-9 rounded-lg"
          required
        />
      </AdminField>
      <AdminField label="Slug">
        <Input name="slug" defaultValue={values?.slug} className="h-9 rounded-lg" required />
      </AdminField>
      <AdminField label="Название">
        <Input name="title" defaultValue={values?.title} className="h-9 rounded-lg" required />
      </AdminField>
      <AdminField label="Дата">
        <Input name="date" type="date" defaultValue={values?.date} className="h-9 rounded-lg" required />
      </AdminField>
      <AdminField label="Время">
        <Input name="startAt" defaultValue={values?.startAt} className="h-9 rounded-lg" required />
      </AdminField>
      <AdminField label="Ссылка на урок">
        <Input name="meetingLink" defaultValue={values?.meetingLink} className="h-9 rounded-lg" required />
      </AdminField>
      <AdminField label="Описание" className="md:col-span-2">
        <Input name="description" defaultValue={values?.description} className="h-9 rounded-lg" required />
      </AdminField>
      <AdminField label="Agenda (JSON)" className="md:col-span-3">
        <Input name="agenda" defaultValue={values?.agenda} className="h-9 rounded-lg" required />
      </AdminField>
      <AdminField label="Статус">
        <select
          name="isCompleted"
          defaultValue={values?.isCompleted !== undefined ? String(values.isCompleted) : "false"}
          className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm"
        >
          <option value="false">Не завершен</option>
          <option value="true">Завершен</option>
        </select>
      </AdminField>
    </>
  );
}
