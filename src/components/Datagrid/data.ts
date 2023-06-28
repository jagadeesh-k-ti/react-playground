import { faker } from "@faker-js/faker";
faker.seed(1337);

export type StudentReport = {
    id: number;
    name: string;
    percentage: string;
    passed: string;
};

export const genReports = () => {
    const percentage = faker.number.float({ max: 100 });
    return {
        id: faker.number.int({ min: 100000, max: 999999 }),
        name: faker.person.fullName(),
        percentage: percentage.toFixed(4),
        passed: percentage > 35 ? "true" : "false",
    } as StudentReport;
};
