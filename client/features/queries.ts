/**
 * The keys used to cache the results of the queries in the cache.
 * The keys are used to identify the data in the cache.
 * The keys are grouped from the most general to the most specific.
 */
export const newsKeys = {
  all: ["news"] as const,
  lists: () => [...newsKeys.all, "list"] as const,
  list: (status: string, page?: string, pageSize?: string) => [...newsKeys.lists(), status, page, pageSize] as const,
  details: () => [...newsKeys.all, "detail"] as const,
  detail: (pkey: string) => [...newsKeys.details(), pkey] as const,
};

export const partnersKeys = {
  all: ["partners"] as const,
  lists: () => [...partnersKeys.all, "list"] as const,
  list: () => [...partnersKeys.lists()] as const,
}
