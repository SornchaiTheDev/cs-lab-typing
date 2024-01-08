export const checkPassword = (password: string) => {
  const requirements = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%]/.test(password),
  };

  const result = {
    pass: Object.values(requirements).every((status) => status),
    requirements,
  };

  return result;
};
