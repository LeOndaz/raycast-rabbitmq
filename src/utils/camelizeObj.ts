import camelcase from "camelcase";

export const camelizeObj = (obj: object) => {
  if (Array.isArray(obj)) {
    throw new Error("camelizeObj only works on map objects");
  }

  const entries = Object.entries(obj).map(([key, value]) => {
    if (Array.isArray(value)) {
      value = value.map(item => camelizeObj(item));
    } else if (typeof value === "object") {
      value = camelizeObj(value);
    }

    return [camelcase(key), value];
  });

  return Object.fromEntries(entries);
};