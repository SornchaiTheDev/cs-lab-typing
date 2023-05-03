import { faker } from "@faker-js/faker";

export const generatePerson = (amount: number) => {
  return new Array(amount).fill(0).map(() => faker.name.firstName());
};
