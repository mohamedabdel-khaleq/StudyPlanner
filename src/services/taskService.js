import API from './api';

export const getTasks = async (token) => {
  const response = await API.get('/tasks/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getTaskById = async (token, taskId) => {
  const response = await API.get(`/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createTask = async (token, taskData) => {
  const response = await API.post('/tasks/', taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateTask = async (token, taskId, taskData) => {
  const response = await API.put(
    `/tasks/${taskId}`,
    taskData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteTask = async (token, taskId) => {
  const response = await API.delete(
    `/tasks/${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const completeTask = async (token, taskId) => {
  const response = await API.patch(
    `/tasks/${taskId}/complete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const undoTask = async (token, taskId) => {
  const response = await API.patch(
    `/tasks/${taskId}/undo`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getCompletedTasks = async (token) => {
  const response = await API.get(
    '/tasks/completed/',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getActiveTasks = async (token) => {
  const response = await API.get(
    '/tasks/active/',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getTodayTasks = async (token) => {
  const response = await API.get(
    '/tasks/today/',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ========================================
// PLANNER
// ========================================

export const getDailyTasks = async (
  token,
  date
) => {
  const response = await API.get(
    '/planner/daily',
    {
      params: {
        date: date,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getWeeklyTasks = async (
  token,
  startDate
) => {
  const response = await API.get(
    '/planner/weekly',
    {
      params: {
        start_date: startDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};