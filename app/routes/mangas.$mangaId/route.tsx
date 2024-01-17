import { LoaderFunctionArgs } from "@remix-run/server-node";
import { useLoaderData } from "@remix-run/react";
import { getMangaDetails } from "~/repositories/mangas";

export const loader = async (args: LoaderFunctionArgs) => {
  const { mangaId } = args.params;

  if (!mangaId) {
    throw new Error("Manga id is required");
  }

  const { data, error } = await getMangaDetails(mangaId);

  if (error) {
    throw new Error(error.message);
  }

  return { manga: data };
};

export default function MangaId() {
  const { manga } = useLoaderData<typeof loader>();
  console.log(manga);
  return (
    <div>
      <h1>{manga.title}</h1>
      <div className="flex flex-row">
        {manga.mangas_tags.map((mt) => (
          <div>
            <span>{mt.tags?.title}</span>
          </div>
        ))}
      </div>
      <div>
        {manga.mangas_authors.map((ma) => (
          <div>
            <span>{ma.authors?.name}</span>
          </div>
        ))}
      </div>
      {manga.pages.map((page) => (
        <img
          width="300"
          className="w-24 h-24"
          src={page.image}
          alt={manga.title}
        />
      ))}
    </div>
  );
}
