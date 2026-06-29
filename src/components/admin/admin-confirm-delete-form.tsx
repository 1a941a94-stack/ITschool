"use client";

import type { ReactNode } from "react";

type AdminConfirmFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  className?: string;
  children: ReactNode;
};

export function AdminConfirmForm({ action, confirmMessage, className, children }: AdminConfirmFormProps) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
}

type AdminConfirmDeleteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  hiddenFields: Record<string, string>;
  className?: string;
  children: ReactNode;
};

export function AdminConfirmDeleteForm({
  action,
  confirmMessage,
  hiddenFields,
  className,
  children,
}: AdminConfirmDeleteFormProps) {
  return (
    <AdminConfirmForm action={action} confirmMessage={confirmMessage} className={className}>
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {children}
    </AdminConfirmForm>
  );
}
