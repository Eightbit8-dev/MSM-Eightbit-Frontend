export const formatAadhar = (value: string) => {
  // Remove all spaces first
  const digits = value.replace(/\s/g, "");
  // Insert space after every 4 digits
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};
