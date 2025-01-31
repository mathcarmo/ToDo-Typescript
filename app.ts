interface Task {
    id: number;
    text: string;
    completed: boolean;
}

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm') as HTMLFormElement;
    const taskInput = document.getElementById('taskInput') as HTMLInputElement;
    const taskList = document.getElementById('taskList') as HTMLUListElement;
    const filterAll = document.getElementById('filterAll') as HTMLButtonElement;
    const filterCompleted = document.getElementById('filterCompleted') as HTMLButtonElement;
    const filterPending = document.getElementById('filterPending') as HTMLButtonElement;

    let tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    let currentFilter: 'all' | 'completed' | 'pending' = 'all';

    // Renderiza as tarefas ao carregar a página
    renderTasks();

    taskForm.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
            taskInput.focus();
        }
    });

    filterAll.addEventListener('click', () => {
        currentFilter = 'all';
        renderTasks();
    });

    filterCompleted.addEventListener('click', () => {
        currentFilter = 'completed';
        renderTasks();
    });

    filterPending.addEventListener('click', () => {
        currentFilter = 'pending';
        renderTasks();
    });

    function addTask(taskText: string): void {
        const newTask: Task = {
            id: Date.now(), // Usa o timestamp como ID único
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
    }

    function toggleTaskCompletion(id: number): void {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(id: number): void {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function editTask(id: number, newText: string): void {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.text = newText;
            saveTasks();
            renderTasks();
        }
    }

    function saveTasks(): void {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(): void {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'completed') return task.completed;
            if (currentFilter === 'pending') return !task.completed;
            return true; // Mostra todas as tarefas
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="edit">Editar</button>
                <button class="delete">X</button>
            `;

            // Marcar/desmarcar tarefa como concluída
            li.addEventListener('click', () => {
                toggleTaskCompletion(task.id);
            });

            // Botão para editar tarefa
            const editButton = li.querySelector('.edit') as HTMLButtonElement;
            editButton.addEventListener('click', (e: Event) => {
                e.stopPropagation();
                const newText = prompt('Editar tarefa:', task.text);
                if (newText !== null && newText.trim() !== '') {
                    editTask(task.id, newText.trim());
                }
            });

            // Botão para excluir tarefa
            const deleteButton = li.querySelector('.delete') as HTMLButtonElement;
            deleteButton.addEventListener('click', (e: Event) => {
                e.stopPropagation();
                deleteTask(task.id);
            });

            taskList.appendChild(li);
        });
    }
});