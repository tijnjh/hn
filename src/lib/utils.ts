import dayjs from "dayjs";
import { tryCatch } from "typecatch";

export function relativify(uts: number) {
  const timestamp = uts * 1000;
  const date = new Date(timestamp);
  const formatted = dayjs(date).fromNow();
  return formatted.replace("about", "");
}

export function formatUrl(url: string) {
  const { data: urlObj, error } = tryCatch(() => new URL(url));
  if (!error) {
    const hostname = urlObj?.hostname;
    return hostname?.startsWith("www.")
      ? hostname.replace("www.", "")
      : hostname;
  } else {
    throw new Error(
      `something went wrong when trying to parse a story url: ${error.message}`,
    );
  }
}
