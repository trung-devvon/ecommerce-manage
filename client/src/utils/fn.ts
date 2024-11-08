export const generateCode = (string: string) => {
  const normalizedString = string.replace(/Đ/g, 'D').replace(/đ/g, 'd');

  const slug = normalizedString
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toUpperCase();

  const reversedCode = string
    .normalize("NFD")
    .replace(/[^a-zA-Z ]/g, "")
    .slice(0, 10)
    .toUpperCase()
    .replace(/ /g, "")
    .split("")
    .reverse()
    .join("");

  return `${slug}-${reversedCode}`;
};
