import React, { useState } from 'react';
import { Task, TaskType } from '../../types/task';
import { TaskCard } from '../TaskCard/TaskCard';
import './Column.css';

interface ColumnProps {
    title: string;
    type: TaskType;
    icon: React.ReactNode;
    tasks: Task[];
    onAddTask: (newTask: Omit<Task, 'id'>) => void;
    onUpdateTask: (updatedTask: Task) => void;
    onDeleteTask: (id: number) => void;
    onDragStart: (e: React.DragEvent, taskId: number) => void;
    onDropTask: (targetType: TaskType) => void;
}

export const Column: React.FC<ColumnProps> = ({
    title,
    type,
    icon,
    tasks,
    onAddTask,
    onUpdateTask,
    onDeleteTask,
    onDragStart,
    onDropTask,
}) => {
    const [isCreating, setIsCreating] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleCreateSave = (draft: Task) => {
        onAddTask({
            type: 'todo',
            startDay: draft.startDay,
            endDay: draft.endDay,
            text: draft.text,
        });
        setIsCreating(false);
    };

    return (
        <section
            className="column"
            onDragOver={handleDragOver}
            onDrop={() => onDropTask(type)}
        >
            <div className="column__header">
                <div className="column__title-wrap">
                    {icon}
                    <h2 className="column__title">{title}</h2>
                </div>
                {type === 'todo' && (
                    <button
                        type="button"
                        className="column__add-btn"
                        onClick={() => setIsCreating(true)}
                    >
                        + Добавить
                    </button>
                )}
            </div>

            <div className="column__list">
                {isCreating && (
                    <TaskCard
                        isNew
                        task={{
                            id: Date.now(),
                            type: 'todo',
                            startDay: Date.now(),
                            endDay: Date.now(),
                            text: '',
                        }}
                        onDelete={() => setIsCreating(false)}
                        onSave={handleCreateSave}
                        onCancelNew={() => setIsCreating(false)}
                        onDragStart={() => { }}
                    />
                )}

                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={onDeleteTask}
                        onSave={onUpdateTask}
                        onDragStart={onDragStart}
                    />
                ))}
            </div>
        </section>
    );
};