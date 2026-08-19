export const getOptimizedImageUrl = (
  url,
  { width = 800, height = 600 } = {},
) => {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace(
    "/upload/",
    `/upload/c_fill,g_auto,w_${width},h_${height},q_auto,f_auto/`,
  );
};
