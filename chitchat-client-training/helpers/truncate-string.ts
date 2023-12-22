export const truncateString = (value: string, max_length: number) => {
  if (value?.length > max_length) {
    return value.slice(0, max_length) + '...';
  }
  return value;
};
