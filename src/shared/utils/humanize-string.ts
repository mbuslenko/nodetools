export const humanizeString = (str: string) => {
  str = str
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/, /g, ",")
    .replace(/,/g, ", ")
    .replace(/\. /g, ".")
    .replace(/\./g, ". ")
    .toLowerCase();

  return str.charAt(0).toUpperCase() + str.slice(1);
};
