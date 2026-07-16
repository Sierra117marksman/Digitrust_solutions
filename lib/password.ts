import bcrypt from "bcryptjs";
import crypto from "crypto";

const PASSWORD_ROUNDS = 12;

export function hashPassword(password: string) {
  return bcrypt.hash(password, PASSWORD_ROUNDS);
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function validatePasswordPolicy(password: string): { valid: boolean; reason?: string } {
  if (password.length < 12) return { valid: false, reason: "Password must be at least 12 characters long." };
  if (password.length > 128) return { valid: false, reason: "Password cannot exceed 128 characters." };
  
  if (!/[A-Z]/.test(password)) return { valid: false, reason: "Password must contain at least one uppercase letter." };
  if (!/[a-z]/.test(password)) return { valid: false, reason: "Password must contain at least one lowercase letter." };
  if (!/[0-9]/.test(password)) return { valid: false, reason: "Password must contain at least one number." };
  if (!/[^A-Za-z0-9]/.test(password)) return { valid: false, reason: "Password must contain at least one special character." };

  return { valid: true };
}

export function generateTempPassword(length = 16): string {
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  
  const allChars = upperCase + lowerCase + numbers + symbols;
  
  let password = "";
  // Ensure at least one of each required character type
  password += upperCase[crypto.randomInt(upperCase.length)];
  password += lowerCase[crypto.randomInt(lowerCase.length)];
  password += numbers[crypto.randomInt(numbers.length)];
  password += symbols[crypto.randomInt(symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(allChars.length)];
  }
  
  // Shuffle the resulting password string
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}
