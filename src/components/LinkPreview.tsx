import { EchoscrapeResponse } from "@/lib/types";
import { IonImg } from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { useState } from "react";

export default function LinkPreview(
  { url, href, className }: {
    url: string;
    href?: string;
    className?: string;
  },
) {
  const { data, isPending, error } = useQuery({
    queryKey: ["echoscrape", url],
    queryFn: () =>
      ofetch<EchoscrapeResponse>(`https://echoscrape.tijn.dev/${url}`),
  });

  const shouldDisplayImage = !isPending &&
    !error &&
    data?.og?.image &&
    data.twitter?.card === "summary_large_image";

  const [imageLoadError, setImageLoadError] = useState(false);

  const Tag = href ? "a" : "div";

  return (
    <Tag
      href={href}
      onClick={(e) => e.stopPropagation()}
      target="_blank"
      style={{ textDecoration: "none !important" }}
      className={`block bg-(--base)! hover:bg-(--gray-6)! border border-(--gray-4) rounded-md overflow-clip transition-colors ${className}`}
    >
      {!imageLoadError && shouldDisplayImage && (
        <IonImg
          className="block"
          onError={() => setImageLoadError(true)}
          src={data.og.image}
          alt={data.og.imageAlt || url}
          style={{
            aspectRatio: `${data.og.imageWidth}/${data.og.imageHeight}`,
          }}
        />
      )}
      <div className="flex items-center gap-4 px-3 py-4">
        <IonImg
          className="block rounded-sm size-8 shrink-0"
          src={`https://www.google.com/s2/favicons?domain=${url}&sz=64`}
        />
        <hgroup className="truncate">
          <h4 className="font-medium! text-(--text)">
            {data?.title}
          </h4>
          <p className="text-(--gray-1) text-xs!">{url}</p>
        </hgroup>
      </div>
    </Tag>
  );
}
