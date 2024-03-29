import './style.css';
import checkboxFormat from '../modules/checkboxformat.js';
import indexNormalization from '../modules/indexnormal.js';
import updateTask from '../modules/updatetask.js';
import removehtml from '../modules/removehtml.js';
import addTask from '../modules/addtask.js';
import clearCompleted from '../modules/clearcompleted.js';

const taskDescription = document.querySelector('input');
let checkbox = []; let taskArray = [];

// Event listener to detect a new task input and call addTask function
taskDescription.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && taskDescription.value) {
    checkbox = document.querySelectorAll('.checkbox');
    event.preventDefault();
    addTask(taskDescription.value);
    // update the taskArray
    const taskObject = {
      description: taskDescription.value,
      completed: false,
      index: checkbox.length + 1,
    };
    taskArray.push(taskObject);
    taskDescription.value = null;
    // update local storage
    localStorage.setItem('mytasks', JSON.stringify(taskArray));
    // update the checkbox variable
    checkbox = document.querySelectorAll('.checkbox');
  }
});

// Load local storage data
const loadLocalStorage = () => {
  const lsTasks = JSON.parse(localStorage.getItem('mytasks'));
  if (lsTasks !== null) {
    lsTasks.forEach((element) => {
      checkbox = document.querySelectorAll('.checkbox');
      addTask(element.description);
      // update the taskArray
      const taskObject = {
        description: element.description,
        completed: false,
        index: checkbox.length + 1,
      };
      taskArray.push(taskObject);
      localStorage.setItem('mytasks', JSON.stringify(taskArray));
    });
  }
};
loadLocalStorage();

// Click listener to remove tasks
document.addEventListener('click', (element) => {
  if (element.target.classList.contains('checkbox') || element.target.classList.contains('trash-active')) {
    checkboxFormat(element);
    removehtml(element);
    checkbox = document.querySelectorAll('.checkbox');
    indexNormalization(checkbox);
    taskArray = JSON.parse(localStorage.getItem('mytasks'));
  }
});

// Change listener to edit tasks
document.addEventListener('change', (element) => {
  updateTask(element);
});

// Listener for clear completed tasks button
document.addEventListener('click', (element) => {
  if (element.target.classList.contains('clear-completed')) {
    clearCompleted();
    checkbox = document.querySelectorAll('.checkbox');
    indexNormalization(checkbox);
    taskArray = JSON.parse(localStorage.getItem('mytasks'));
  }
});

// Listener por focus input field
document.addEventListener('click', (element) => {
  if (element.target.classList.contains('fa-ellipsis-v')) {
    const end = element.target.parentElement.children[1].value.length;
    element.target.parentElement.children[1].setSelectionRange(end, end);
    element.target.parentElement.children[1].focus();
  }
});

const reorderTasks = (start, end, array) => {
  const arrtmp = [];
  arrtmp[end] = array[start];
  if (start > end) {
    for (let i = 0; i < array.length; i += 1) {
      if (i > end && i <= start) {
        arrtmp[i] = array[i - 1];
      }
      if (i < end || i > start) {
        arrtmp[i] = array[i];
      }
    }
    return arrtmp;
  }

  for (let i = 0; i < array.length; i += 1) {
    if (i >= start && i < end) {
      arrtmp[i] = array[i + 1];
    }
    if (i < start || i > end) {
      arrtmp[i] = array[i];
    }
  }
  return arrtmp;
};

// Select the draggable element
let dragStartIndex; let
  dragEndIndex;
document.querySelectorAll('.task-container').forEach((task) => {
  task.addEventListener('dragstart', () => {
    dragStartIndex = +task.closest('div').getAttribute('id');
  });
  task.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  task.addEventListener('dragenter', () => {
    task.classList.add('drag-over');
  });
  task.addEventListener('dragleave', () => {
    task.classList.remove('drag-over');
  });
  task.addEventListener('drop', () => {
    dragEndIndex = +task.closest('div').getAttribute('id');
    taskArray = reorderTasks(dragStartIndex - 1, dragEndIndex - 1, taskArray);
    // Fix indexes
    for (let i = 0; i < taskArray.length; i += 1) {
      taskArray[i].index = i + 1;
    }
    localStorage.setItem('mytasks', JSON.stringify(taskArray));
    document.querySelectorAll('.checkbox').forEach((elem) => {
      elem.parentElement.remove();
    });
    taskArray.forEach((element) => {
      addTask(element.description);
    });
  });
});
