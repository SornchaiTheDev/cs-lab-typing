export function isArrayUnique(myArray: unknown[]) {
  return myArray.length === new Set(myArray).size;
}
