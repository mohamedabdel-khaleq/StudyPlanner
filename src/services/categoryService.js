import API from './api';

export const getCategories = async (token) => {
  const response = await API.get('/categories/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createCategory = async (
  token,
  categoryData
) => {
  const response = await API.post(
    '/categories/',
    categoryData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateCategory = async (
  token,
  categoryId,
  categoryData
) => {
  const response = await API.put(
    `/categories/${categoryId}`,
    categoryData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteCategory = async (
  token,
  categoryId
) => {
  const response = await API.delete(
    `/categories/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};