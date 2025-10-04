// ==========================================================
// 4.1. Core Elements dan Task List Array (Inisialisasi)
// ==========================================================
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');
const filterSelect = document.getElementById('filter-select');

// Ambil data tugas dari Local Storage, jika ada. Jika tidak, inisialisasi array kosong.
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// ==========================================================
// 4.3. Feature Implementation (Save to Local Storage)
// ==========================================================
// Fungsi untuk menyimpan array 'tasks' ke Local Storage agar data tetap tersimpan
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ==========================================================
// 4.2. Render/Display Logic
// ==========================================================
function renderTodoList() {
    todoList.innerHTML = ''; // Hapus daftar yang ada sebelum merender ulang

    const filterValue = filterSelect.value;

    // Terapkan penyaringan (filtering) berdasarkan nilai 'filterSelect'
    const filteredTasks = tasks.filter(task => {
        if (filterValue === 'all') {
            return true;
        } else if (filterValue === 'completed') {
            return task.completed;
        } else if (filterValue === 'pending') {
            return !task.completed;
        }
        return true;
    });

    filteredTasks.forEach(task => {
        // 1. Buat List Item (li)
        const listItem = document.createElement('li');
        listItem.classList.add(task.completed ? 'completed' : 'pending');
        listItem.dataset.id = task.id;

        // 2. Task text dan tanggal (dapat diklik untuk mengubah status selesai)
        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        
        let displayDate = task.date ? ` (Tenggat: ${task.date})` : '';
        taskText.textContent = `${task.text}${displayDate}`;
        
        // Tambahkan event listener untuk mengubah status selesai/belum selesai
        taskText.addEventListener('click', () => toggleTaskCompletion(task.id));

        // 3. Tombol Delete
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Hapus';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id)); // Panggil fungsi hapus

        // 4. Gabungkan elemen ke listItem
        listItem.appendChild(taskText);
        listItem.appendChild(deleteBtn);
        todoList.appendChild(listItem);
    });

    // Simpan perubahan ke local storage setelah rendering
    saveTasks(); 
}

// ==========================================================
// 4.3. Feature Implementation (Add, Toggle, Delete)
// ==========================================================

// Fungsi: Tambah Tugas (Add Task)
function addTask(event) {
    event.preventDefault(); // Mencegah form reload halaman

    const todoText = todoInput.value.trim();
    const todoDate = dateInput.value;

    if (todoText === '') return; // Jangan tambahkan tugas kosong

    const newTask = {
        id: Date.now().toString(), // ID unik sederhana
        text: todoText,
        date: todoDate,
        completed: false
    };

    tasks.push(newTask);
    todoInput.value = ''; // Kosongkan input teks
    dateInput.value = ''; // Kosongkan input tanggal
    renderTodoList(); // Render ulang daftar
}

// Fungsi: Ubah Status Selesai (Toggle Completion)
function toggleTaskCompletion(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        renderTodoList(); // Render ulang daftar untuk menampilkan perubahan status
    }
}

// Fungsi: Hapus Tugas (Delete Task)
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id); // Filter keluar tugas dengan ID yang cocok
    renderTodoList(); // Render ulang daftar
}

// ==========================================================
// Event Listeners dan Initial Load
// ==========================================================

// Event listener untuk pengiriman form (menambahkan tugas)
todoForm.addEventListener('submit', addTask);

// Event listener untuk perubahan filter (menyaring daftar)
filterSelect.addEventListener('change', renderTodoList);

// Muat dan tampilkan tugas saat halaman pertama kali dimuat
renderTodoList();