export const urlToName = (url: string) => {
  if (url.startsWith("//")) {
    return url.slice(2);
  }

  const protocolIndex = url.indexOf("://");
  return protocolIndex === -1 ? url : url.slice(protocolIndex + 3);
};

export const addQueryParams = (
  urlString: string,
  query: Record<string, string>
): string => {
  try {
    const url = new URL(urlString);

    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }

    return url.toString();
  } catch {
    return urlString;
  }
};
