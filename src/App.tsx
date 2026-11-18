import React, { useState, useEffect, useMemo } from 'react';
import { Smile, Laugh, Meh, Ghost } from 'lucide-react';
import initialTasks from './data/tasks.json';
import { Task, TaskType } from './types/task';
import { formatDate, normalizeTimestamp } from './utils/dateUtils';
import { Header } from './components/Header/Header';
import { Column } from './components/Column/Column';
import './App.css';

const STORAGE_KEY = 'kanban_tasks_v1';

const COLUMNS: { type: TaskType; title: string; icon: React.ReactNode }[] = [
    { type: 'todo', title: 'To Do', icon: <Smile size={20} /> },
    { type: 'in_progress', title: 'In Progress', icon: <Laugh size={20} /> },
    { type: 'review', title: 'Review', icon: <Meh size={20} /> },
    { type: 'done', title: 'Done', icon: <Ghost size={20} /> },
];

export const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch {
                // fallback на JSON
            }
        }
        return initialTasks as Task[];
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = (newTaskData: Omit<Task, 'id'>) => {
        const newTask: Task = {
            ...newTaskData,
            id: Date.now(),
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const handleUpdateTask = (updated: Task) => {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    };

    const handleDeleteTask = (id: number) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const handleDropTask = (targetType: TaskType) => {
        if (draggedTaskId === null) return;
        setTasks((prev) =>
            prev.map((t) => (t.id === draggedTaskId ? { ...t, type: targetType } : t))
        );
        setDraggedTaskId(null);
    };

    const filteredAndSortedTasks = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const isDateQuery = /^\d{2}\.\d{2}\.\d{4}$/.test(query);

        return tasks
            .filter((task) => {
                if (!query) return true;
                if (isDateQuery) {
                    return (
                        formatDate(task.startDay) === query ||
                        formatDate(task.endDay) === query
                    );
                }
                return task.text.toLowerCase().includes(query);
            })
            .sort((a, b) => normalizeTimestamp(a.startDay) - normalizeTimestamp(b.startDay));
    }, [tasks, searchQuery]);

    return (
        <div className="app-wrapper">
            <div className="app-container">
                <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                <main className="board">
                    {COLUMNS.map((col) => (
                        <Column
                            key={col.type}
                            type={col.type}
                            title={col.title}
                            icon={col.icon}
                            tasks={filteredAndSortedTasks.filter((t) => t.type === col.type)}
                            onAddTask={handleAddTask}
                            onUpdateTask={handleUpdateTask}
                            onDeleteTask={handleDeleteTask}
                            onDragStart={(_, id) => setDraggedTaskId(id)}
                            onDropTask={handleDropTask}
                        />
                    ))}
                </main>
            </div>
        </div>
    );
};

export default App;