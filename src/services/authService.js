
import API from './api';

export const registerUser = async (name, email, password) => {
  return await API('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};

export const loginUser = async (email, password) => {
  return await API('/auth/login', {
    Method: 'POST',
    Body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const getCurrentUser = async (token) => {
  return await API('/auth/me', {
    Method: 'GET',
    Headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
