import { faker } from "@faker-js/faker";

export const generatePerson = (amount: number) => {
  const people = new Array(amount).fill(0).map(() => faker.name.firstName());
  const uniquePeople = [...new Set(people)];
  return uniquePeople;
};
