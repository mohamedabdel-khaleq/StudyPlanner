import API from './api';

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Normalize Arabic + English text
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
};

// Get all tasks
const getTasks = async (token) => {
  const response = await API.get('/tasks/', authConfig(token));
  return response.data;
};

// Get today's tasks
const getTodayTasks = async (token) => {
  const response = await API.get('/tasks/today/', authConfig(token));
  return response.data;
};

// Get completed tasks
const getCompletedTasks = async (token) => {
  const response = await API.get(
    '/tasks/completed/',
    authConfig(token)
  );

  return response.data;
};

// Get active tasks
const getActiveTasks = async (token) => {
  const response = await API.get(
    '/tasks/active/',
    authConfig(token)
  );

  return response.data;
};

// Get categories
const getCategories = async (token) => {
  const response = await API.get(
    '/categories/',
    authConfig(token)
  );

  return response.data;
};

// Get progress
const getProgress = async (token) => {
  const response = await API.get(
    '/progress/progress',
    authConfig(token)
  );

  return response.data;
};

// Get daily planner
const getDailyPlanner = async (token, date) => {
  const response = await API.get('/planner/daily', {
    params: {
      date,
    },
    ...authConfig(token),
  });

  return response.data;
};

// Complete task
const completeTask = async (token, taskId) => {
  const response = await API.patch(
    `/tasks/${taskId}/complete`,
    {},
    authConfig(token)
  );

  return response.data;
};

// Undo task
const undoTask = async (token, taskId) => {
  const response = await API.patch(
    `/tasks/${taskId}/undo`,
    {},
    authConfig(token)
  );

  return response.data;
};

// Delete task
const deleteTask = async (token, taskId) => {
  const response = await API.delete(
    `/tasks/${taskId}`,
    authConfig(token)
  );

  return response.data;
};

// Create task
const createTask = async (token, taskData) => {
  const response = await API.post(
    '/tasks/',
    taskData,
    authConfig(token)
  );

  return response.data;
};

// Find task by name
const findTask = (tasks, searchText) => {
  const normalizedSearch = normalizeText(searchText);

  return tasks.find((task) => {
    const title = normalizeText(task.title || '');

    return (
      title.includes(normalizedSearch) ||
      normalizedSearch.includes(title)
    );
  });
};

// Format tasks
const formatTasks = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return 'مفيش مهام عندك حاليًا. 🎉';
  }

  return tasks
    .map((task, index) => {
      const status = task.completed ? '✅' : '⏳';

      return `${index + 1}. ${status} ${task.title}
   📅 ${task.due_date}
   ⚡ ${task.priority}`;
    })
    .join('\n\n');
};

// Get today's date
const getTodayDate = () => {
  const date = new Date();

  return date.toISOString().split('T')[0];
};

// Get tomorrow date
const getTomorrowDate = () => {
  const date = new Date();

  date.setDate(date.getDate() + 1);

  return date.toISOString().split('T')[0];
};

// Extract task title from create command
const extractTaskTitle = (message) => {
  let title = message
    .replace(
      /ضيفلي|ضيف|اعمللي|اعملي|اعمل|أضفلي|اضفلي|اضف|add|create|new task/gi,
      ''
    )
    .trim();

  title = title
    .replace(/بكره|بكرة|غدا|غداً|tomorrow/gi, '')
    .replace(/النهارده|اليوم|today/gi, '')
    .trim();

  return title;
};

// Main chatbot
export const sendAIMessage = async (token, message) => {
  const text = normalizeText(message);

  if (!token) {
    throw new Error('Authentication token is missing');
  }

  /*
   * HELP
   */
  if (
    text.includes('مساعده') ||
    text.includes('help') ||
    text === 'ماذا تستطيع'
  ) {
    return {
      message: `أنا StudyMate AI 🤖

أقدر أساعدك في:

📋 عرض مهامك
• وريني مهامي
• ايه المهام عندي؟

📅 مهام اليوم
• ايه عندي النهارده؟
• ماذا أذاكر اليوم؟

📊 التقدم
• ايه تقدمي؟
• نسبة الإنجاز كام؟

📚 Categories
• وريني التصنيفات

🗓️ Planner
• اعمللي خطة النهارده

✅ إكمال مهمة
• خلص Network

↩️ التراجع
• رجع Network

🗑️ حذف
• احذف Network

➕ إضافة
• ضيفلي مذاكرة Network بكرة`,
    };
  }

  /*
   * PROGRESS
   */
  if (
    text.includes('تقدم') ||
    text.includes('انجاز') ||
    text.includes('نسبه') ||
    text.includes('progress') ||
    text.includes('completion')
  ) {
    const progress = await getProgress(token);

    return {
      message: `📊 تقدمك الحالي:

📝 إجمالي المهام: ${progress.total_tasks}

✅ المهام المكتملة: ${progress.completed_tasks}

⏳ المهام المتبقية: ${progress.pending_tasks}

🎯 نسبة الإنجاز: ${progress.completion_rate}%`,
    };
  }

  /*
   * CATEGORIES
   */
  if (
    text.includes('تصنيفات') ||
    text.includes('تصنيف') ||
    text.includes('categories') ||
    text.includes('category')
  ) {
    const categories = await getCategories(token);

    if (!categories || categories.length === 0) {
      return {
        message: 'مفيش Categories عندك حاليًا.',
      };
    }

    return {
      message:
        '📚 التصنيفات عندك:\n\n' +
        categories
          .map((category, index) => {
            return `${index + 1}. ${category.name}`;
          })
          .join('\n'),
    };
  }

  /*
   * TODAY TASKS
   */
  if (
    text.includes('النهارده') ||
    text.includes('اليوم') ||
    text.includes('today') ||
    text.includes('ماذا اذاكر') ||
    text.includes('ايه عندي')
  ) {
    const tasks = await getTodayTasks(token);

    return {
      message:
        tasks && tasks.length
          ? `📅 مهامك النهارده:\n\n${formatTasks(tasks)}`
          : '🎉 مفيش مهام للنهارده. يوم فاضي للمذاكرة أو الراحة!',
    };
  }

  /*
   * COMPLETED TASKS
   */
  if (
    text.includes('مكتمله') ||
    text.includes('خلصتها') ||
    text.includes('completed')
  ) {
    const tasks = await getCompletedTasks(token);

    return {
      message:
        tasks && tasks.length
          ? `✅ المهام المكتملة:\n\n${formatTasks(tasks)}`
          : 'لسه مفيش مهام مكتملة.',
    };
  }

  /*
   * PLANNER
   */
  if (
    text.includes('خطه') ||
    text.includes('خطة') ||
    text.includes('planner') ||
    text.includes('plan')
  ) {
    const today = getTodayDate();

    const tasks = await getDailyPlanner(token, today);

    if (!tasks || tasks.length === 0) {
      return {
        message: '📅 مفيش مهام في خطة النهارده.',
      };
    }

    const pendingTasks = tasks.filter(
      (task) => !task.completed
    );

    const completedTasks = tasks.filter(
      (task) => task.completed
    );

    let response = `🧠 خطة مذاكرتك النهارده:

`;

    if (pendingTasks.length > 0) {
      response += `📚 المهام المطلوبة:\n\n`;

      pendingTasks.forEach((task, index) => {
        response += `${index + 1}. ${task.title} — ${task.priority}\n`;
      });
    }

    if (completedTasks.length > 0) {
      response += `\n\n✅ خلصت بالفعل:\n\n`;

      completedTasks.forEach((task) => {
        response += `• ${task.title}\n`;
      });
    }

    return {
      message: response,
    };
  }

  /*
   * COMPLETE TASK
   */
  if (
    text.includes('خلص') ||
    text.includes('اكمل') ||
    text.includes('انجز') ||
    text.includes('complete') ||
    text.includes('finish')
  ) {
    const keywords = text
      .replace(
        /خلصلي|خلص|اكمل|انجز|complete|finish|مهمه|مهمة/gi,
        ''
      )
      .trim();

    const tasks = await getTasks(token);

    const task = findTask(tasks, keywords);

    if (!task) {
      return {
        message: `مش لاقي مهمة باسم "${keywords}". 🤔

اكتب "وريني مهامي" عشان أشوفلك المهام الموجودة.`,
      };
    }

    if (task.completed) {
      return {
        message: `المهمة "${task.title}" مكتملة بالفعل ✅`,
      };
    }

    await completeTask(token, task.id);

    return {
      message: `تم إكمال مهمة "${task.title}" بنجاح ✅🎉`,
    };
  }

  /*
   * UNDO TASK
   */
  if (
    text.includes('رجع') ||
    text.includes('الغاء') ||
    text.includes('إلغاء') ||
    text.includes('undo')
  ) {
    const keywords = text
      .replace(
        /رجع|الغاء|إلغاء|undo|مهمه|مهمة/gi,
        ''
      )
      .trim();

    const tasks = await getTasks(token);

    const task = findTask(tasks, keywords);

    if (!task) {
      return {
        message: `مش لاقي مهمة باسم "${keywords}".`,
      };
    }

    await undoTask(token, task.id);

    return {
      message: `رجعت مهمة "${task.title}" لقائمة المهام ↩️`,
    };
  }

  /*
   * DELETE TASK
   */
  if (
    text.includes('احذف') ||
    text.includes('امسح') ||
    text.includes('delete') ||
    text.includes('remove')
  ) {
    const keywords = text
      .replace(
        /احذف|امسح|delete|remove|مهمه|مهمة/gi,
        ''
      )
      .trim();

    const tasks = await getTasks(token);

    const task = findTask(tasks, keywords);

    if (!task) {
      return {
        message: `مش لاقي مهمة باسم "${keywords}".`,
      };
    }

    await deleteTask(token, task.id);

    return {
      message: `تم حذف مهمة "${task.title}" 🗑️`,
    };
  }

  /*
   * CREATE TASK
   */
  if (
    text.includes('ضيف') ||
    text.includes('اضف') ||
    text.includes('أضف') ||
    text.includes('اعمللي') ||
    text.includes('اعملي') ||
    text.includes('create') ||
    text.includes('add task')
  ) {
    const title = extractTaskTitle(message);

    if (!title) {
      return {
        message:
          'تمام 👍 قولي اسم المهمة اللي عايز تضيفها.\n\nمثال:\nضيفلي مذاكرة Network بكرة',
      };
    }

    const dueDate = text.includes('بكره') ||
      text.includes('بكرة') ||
      text.includes('tomorrow')
      ? getTomorrowDate()
      : getTodayDate();

    const categories = await getCategories(token);

    const defaultCategory =
      categories && categories.length > 0
        ? categories[0]
        : null;

    const taskData = {
      title,
      description: '',
      due_date: dueDate,
      priority: 'medium',
    };

    if (defaultCategory) {
      taskData.category_id = defaultCategory.id;
    }

    const createdTask = await createTask(token, taskData);

    return {
      message: `تمت إضافة المهمة بنجاح ✅

📝 ${createdTask.title || title}
📅 ${createdTask.due_date || dueDate}
⚡ ${createdTask.priority || 'medium'}`,
    };
  }

  /*
   * ALL TASKS
   */
  if (
    text.includes('مهامي') ||
    text.includes('المهام') ||
    text.includes('tasks') ||
    text.includes('task')
  ) {
    const tasks = await getTasks(token);

    return {
      message: `📋 كل مهامك:\n\n${formatTasks(tasks)}`,
    };
  }

  /*
   * DEFAULT RESPONSE
   */
  return {
    message: `🤖 فاهم إنك بتكلمني عن الـ Study Planner، لكن مش فاهم الطلب ده لسه.

جرب مثلًا:

• وريني مهامي
• ايه عندي النهارده؟
• ايه تقدمي؟
• وريني التصنيفات
• اعمللي خطة النهارده
• خلص Network
• رجع Network
• احذف Network
• ضيفلي مذاكرة Network بكرة`,
  };
};