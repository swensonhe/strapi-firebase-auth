export default (jsonString: string): boolean | object => {
  try {
    const object = JSON.parse(jsonString);

    if (object && typeof object === "object") {
      return object;
    }
  } catch (e) {
    return false;
  }

  return false;
};
