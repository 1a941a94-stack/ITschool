import Link from "next/link";
import { Eye, FileDown } from "lucide-react";

import { FadeIn } from "@/components/common/fade-in";
import { PageHeading } from "@/components/common/page-heading";
import { SectionCard } from "@/components/common/section-card";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function DocumentsPage() {
  const user = await requireUser();
  const documents = await prisma.employmentDocument.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <FadeIn>
        <PageHeading
          eyebrow="Документы"
          title="Документы для трудоустройства"
          description="Ваши персональные документы, которые можно открыть и скачать в один клик."
        />
      </FadeIn>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((doc, index) => (
          <FadeIn key={doc.id} delay={0.05 * (index + 1)}>
            <SectionCard className="flex h-full flex-col justify-between gap-5">
              <div>
                <h3 className="text-lg font-semibold">{doc.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{doc.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={doc.previewHref}
                  className={cn(buttonVariants({ variant: "secondary" }), "rounded-xl bg-white/80")}
                >
                  <Eye size={16} />
                  Просмотреть
                </Link>
                <Link href={doc.downloadHref} className={cn(buttonVariants(), "rounded-xl")}>
                  <FileDown size={16} />
                  Скачать PDF
                </Link>
              </div>
            </SectionCard>
          </FadeIn>
        ))}
        {!documents.length ? (
          <SectionCard>
            <p className="text-sm text-muted-foreground">Для вас пока не опубликованы документы.</p>
          </SectionCard>
        ) : null}
      </div>
    </div>
  );
}
