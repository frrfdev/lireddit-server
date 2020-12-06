interface Error {
  code: string;
  detail: string;
}

export const alreadyExists = (error: Error): Boolean => {
  return error.code === "23505" || error.detail.includes("already exists");
};
