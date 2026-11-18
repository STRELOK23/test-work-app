import React, { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Task } from '../../types/task';
import { formatDate, parseDateString, isTaskOverdue } from '../../utils/dateUtils';
import './TaskCard.css';

interface TaskCardProps {
    task: Task;
    isNew?: boolean;
    onDelete: (id: number) => void;
    onSave: (updatedTask: Task) => void;
    onCancelNew?: () => void;
    onDragStart: (e: React.DragEvent, taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    isNew = false,
    onDelete,
    onSave,
    onCancelNew,
    onDragStart,
}) => {
    const [isEditing, setIsEditing] = useState(isNew);
    const [startStr, setStartStr] = useState(formatDate(task.startDay));
    const [endStr, setEndStr] = useState(formatDate(task.endDay));
    const [text, setText] = useState(task.text);
    const [error, setError] = useState(false);

    const overdue = isTaskOverdue(task);
    const canEdit = task.type === 'todo';

    const handleSave = () => {
        const parsedStart = parseDateString(startStr);
        const parsedEnd = parseDateString(endStr);

        if (!parsedStart || !parsedEnd || !text.trim()) {
            setError(true);
            return;
        }

        setError(false);
        onSave({
            ...task,
            startDay: parsedStart,
            endDay: parsedEnd,
            text: text.trim(),
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (isNew && onCancelNew) {
            onCancelNew();
            return;
        }
        setStartStr(formatDate(task.startDay));
        setEndStr(formatDate(task.endDay));
        setText(task.text);
        setError(false);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className={`task-card task-card--editing ${error ? 'task-card--error' : ''}`}>
                <div className="task-card__field">
                    <span className="task-card__label">Начало:</span>
                    <input
                        className="task-card__input"
                        value={startStr}
                        placeholder="dd.mm.yyyy"
                        onChange={(e) => setStartStr(e.target.value)}
                    />
                </div>
                <div className="task-card__field">
                    <span className="task-card__label">Окончание:</span>
                    <input
                        className="task-card__input"
                        value={endStr}
                        placeholder="dd.mm.yyyy"
                        onChange={(e) => setEndStr(e.target.value)}
                    />
                </div>
                <div className="task-card__field">
                    <span className="task-card__label">Описание:</span>
                    <input
                        className="task-card__input"
                        value={text}
                        placeholder="Описание задачи"
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="task-card__edit-actions">
                    <button type="button" className="icon-btn icon-btn--cancel" onClick={handleCancel}>
                        <X size={14} />
                    </button>
                    <button type="button" className="icon-btn icon-btn--confirm" onClick={handleSave}>
                        <Check size={14} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`task-card ${overdue ? 'task-card--overdue' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
        >
            <div className="task-card__actions">
                {canEdit && (
                    <button
                        type="button"
                        className="task-card__action-btn"
                        onClick={() => setIsEditing(true)}
                        title="Редактировать"
                    >
                        <Pencil size={14} />
                    </button>
                )}
                <button
                    type="button"
                    className="task-card__action-btn task-card__action-btn--delete"
                    onClick={() => onDelete(task.id)}
                    title="Удалить"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="task-card__row">
                <span className="task-card__label">Начало:</span>
                <span className="task-card__value">{formatDate(task.startDay)}</span>
            </div>
            <div className="task-card__row">
                <span className="task-card__label">Окончание:</span>
                <span className={`task-card__value ${overdue ? 'task-card__value--overdue' : ''}`}>
                    {formatDate(task.endDay)}
                </span>
            </div>
            <div className="task-card__row">
                <span className="task-card__label">Описание:</span>
                <span className="task-card__value">{task.text}</span>
            </div>
        </div>
    );
};