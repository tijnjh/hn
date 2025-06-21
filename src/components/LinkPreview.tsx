import { EchoscrapeResponse } from "@/lib/types";
import { IonImg } from "@ionic/react";
import { useState } from "react";

export default function LinkPreview(
  { url, metadata, href, className }: {
    url: string;
    metadata?: EchoscrapeResponse;
    href?: string;
    className?: string;
  },
) {
  const shouldDisplayImage = metadata?.og?.image &&
    metadata.twitter?.card === "summary_large_image";

  const [imageLoadError, setImageLoadError] = useState(false);

  const Tag = href ? "a" : "div";

  return (
    <Tag
      href={href}
      onClick={(e) => void e.stopPropagation()}
      target="_blank"
      style={{ textDecoration: "none !important" }}
      className={`block bg-(--base)! hover:bg-(--gray-6)! border border-(--gray-4) rounded-md overflow-clip transition-colors ${className}`}
    >
      {!imageLoadError && shouldDisplayImage && (
        <IonImg
          className="block"
          onError={() => void setImageLoadError(true)}
          src={metadata.og.image}
          alt={metadata.og.imageAlt || url}
          style={{
            aspectRatio: `${metadata.og.imageWidth}/${metadata.og.imageHeight}`,
          }}
        />
      )}
      <div className="flex items-center gap-4 px-3 py-4">
        {metadata && <Favicon metadata={metadata} />}
        <hgroup className="truncate">
          <h4 className="font-medium! text-(--text)">
            {metadata?.title}
          </h4>
          <p className="text-(--gray-1) text-xs!">{url}</p>
        </hgroup>
      </div>
    </Tag>
  );
}

function Favicon({ metadata }: { metadata: EchoscrapeResponse }) {
  const [imageLoadError, setImageLoadError] = useState(false);

  if (imageLoadError) {
    return null;
  }

  return (
    <IonImg
      className="block rounded-sm size-8 shrink-0"
      src={metadata?.favicon}
      onIonError={() => void setImageLoadError(true)}
      ref={(elt) => void (elt && !elt.src && setImageLoadError(true))}
    />
  );
}
