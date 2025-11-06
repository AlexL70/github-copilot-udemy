import Pagination from "./Pagination";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

const employees: Employee[] = [
  { id: 1, firstName: "Alice", lastName: "Smith" },
  { id: 2, firstName: "Bob", lastName: "Johnson" },
  { id: 3, firstName: "Charlie", lastName: "Williams" },
  { id: 4, firstName: "David", lastName: "Brown" },
  { id: 5, firstName: "Eva", lastName: "Jones" },
  { id: 6, firstName: "Frank", lastName: "Garcia" },
  { id: 7, firstName: "Grace", lastName: "Martinez" },
  { id: 8, firstName: "Henry", lastName: "Davis" },
  { id: 9, firstName: "Ivy", lastName: "Rodriguez" },
  { id: 10, firstName: "Jack", lastName: "Miller" },
  { id: 11, firstName: "Karen", lastName: "Wilson" },
  { id: 12, firstName: "Leo", lastName: "Moore" },
  { id: 13, firstName: "Mia", lastName: "Taylor" },
  { id: 14, firstName: "Nina", lastName: "Anderson" },
  { id: 15, firstName: "Oscar", lastName: "Thomas" },
  { id: 16, firstName: "Paul", lastName: "Jackson" },
  { id: 17, firstName: "Quinn", lastName: "White" },
  { id: 18, firstName: "Rose", lastName: "Harris" },
  { id: 19, firstName: "Sam", lastName: "Martin" },
  { id: 20, firstName: "Tina", lastName: "Thompson" },
  { id: 21, firstName: "Uma", lastName: "Young" },
  { id: 22, firstName: "Victor", lastName: "King" },
  { id: 23, firstName: "Wendy", lastName: "Scott" },
  { id: 24, firstName: "Xander", lastName: "Green" },
  { id: 25, firstName: "Yara", lastName: "Baker" },
  { id: 26, firstName: "Zane", lastName: "Adams" },
  { id: 27, firstName: "Amy", lastName: "Nelson" },
  { id: 28, firstName: "Brian", lastName: "Carter" },
  { id: 29, firstName: "Cathy", lastName: "Mitchell" },
  { id: 30, firstName: "Derek", lastName: "Perez" },
];

export default function Employees() {
  return (
    <div>
      <Pagination totalPages={Math.ceil(employees.length / 5)} />
    </div>
  );
}
