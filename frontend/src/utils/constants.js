// src/utils/constants.js

// API Base URL
export const API_BASE_URL = 'http://localhost:3000';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
};

// File Types
export const ACCEPTED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC: 'application/msword',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  XLS: 'application/vnd.ms-excel',
  TXT: 'text/plain',
};

// File Extensions
export const ACCEPTED_FILE_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.txt',
];

// Max File Size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Toast/Notification Duration
export const NOTIFICATION_DURATION = 3000;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  THEME: 'theme',
};

// Messages
export const MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  REGISTER_SUCCESS: 'Registration successful! Please login.',
  REGISTER_FAILED: 'Registration failed. Please try again.',
  UPLOAD_SUCCESS: 'Files uploaded successfully!',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  APPROVAL_SUCCESS: 'Employee approved successfully!',
  APPROVAL_FAILED: 'Approval failed. Please try again.',
  REJECTION_SUCCESS: 'Employee rejected successfully!',
  REJECTION_FAILED: 'Rejection failed. Please try again.',
};
