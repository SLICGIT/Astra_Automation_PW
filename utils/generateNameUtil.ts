const { faker } = require('@faker-js/faker');

export class GenerateName {

  static getName(): string {
    let name: string = faker.person.firstName();

    // Ensure name length is at least 3 characters
    while (name.length < 3) {
      name = faker.person.firstName();
    }

    return name;
  }

}