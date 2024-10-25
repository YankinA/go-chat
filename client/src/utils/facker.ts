import { faker } from '@faker-js/faker';
import { User } from '../store/types';

export function createRandomUser() {
  return {
    name: faker.internet.userName(),
  };
}
