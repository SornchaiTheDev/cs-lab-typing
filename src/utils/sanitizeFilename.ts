export const sanitizeFilename = (filename: string) => {
  return filename.replace(/[^a-z0-9]/gi, "_").toLowerCase();
};
