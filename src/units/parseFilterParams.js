export const parseBoolean = (value) => {
  if (typeof value !== 'string') return;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
};

const parseContactType = (type) => {
  const validTypes = ['work', 'home', 'personal'];
  if (typeof type === 'string' && validTypes.includes(type)) {
    return type;
  }
};

export const parseFilterParams = (query) => {
  const { type, isFavourite, name, email, phone } = query;

  const parsedType = parseContactType(type);
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
    name,
    email,
    phone,
  };
};
