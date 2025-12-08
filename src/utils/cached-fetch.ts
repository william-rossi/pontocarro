export async function cachedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const revalidateTime = Number.parseInt(process.env.NEXT_PUBLIC_CACHE_REVALIDATE ?? '300')
  const defaultOptions = {
    next: { revalidate: revalidateTime },
  };

  const mergedInit = {
    ...init,
    ...defaultOptions,
    next: { ...init?.next, ...defaultOptions.next },
  };

  return fetch(input, mergedInit);
}
