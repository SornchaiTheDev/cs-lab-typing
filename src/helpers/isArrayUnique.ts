export function isArrayUnique(myArray: any[]) {
  return myArray.length === new Set(myArray).size;
}
