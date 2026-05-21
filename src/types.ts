export interface Student {
  id: string;
  name: string;
  dob: string;
  gender: string;
  class: string;
  roll?: string;
  parent: string;
  phone: string;
  address?: string;
  aadhaar?: string;
  prevSchool?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  email?: string;
  qualification: string;
  experience?: string;
  classes: string[]; // comma-separated strings represented as an array
  subjects: string;
  joinDate?: string;
  salary?: string;
  createdAt?: any;
}

export interface Admission {
  id: string;
  name: string;
  dob: string;
  gender: string;
  class: string;
  parent: string;
  phone: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  prevSchool?: string;
  remarks?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  amount: number;
  date: string;
  type: string; // "Tuition" | "Transport" | "Uniform" | "Books" | "Exam" | "Other"
  month?: string;
  status: "Paid" | "Pending";
  notes?: string;
  createdAt?: any;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  class: string;
  studentId: string;
  studentName: string;
  status: "Present" | "Absent";
  updatedAt?: any;
}
