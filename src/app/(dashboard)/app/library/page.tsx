import { LibraryView } from "@/components/library/library-view";
import { prisma } from "@/lib/prisma";

export default async function LibraryPage() {
  const items = await prisma.libraryItem.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <LibraryView
      items={items.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        type: item.type,
        href: item.href,
        updatedAt: item.updatedAt.toLocaleDateString("ru-RU"),
      }))}
    />
  );
}
