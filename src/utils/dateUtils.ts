import { Task } from '../types/task';

// Приведение к миллисекундам (если в JSON секунды)
export const normalizeTimestamp = (ts: number): number =>
    ts < 10000000000 ? ts * 1000 : ts;

// Форматирование timestamp -> "dd.mm.yyyy"
export const formatDate = (timestamp: number): string => {
    const date = new Date(normalizeTimestamp(timestamp));
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
};

// Парсинг "dd.mm.yyyy" -> timestamp (или null, если дата невалидна)
export const parseDateString = (dateStr: string): number | null => {
    const match = dateStr.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!match) return null;

    const [, dd, mm, yyyy] = match;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));

    if (
        date.getFullYear() !== Number(yyyy) ||
        date.getMonth() !== Number(mm) - 1 ||
        date.getDate() !== Number(dd)
    ) {
        return null;
    }
    return date.getTime();
};

// Функция для unit-теста: проверка просроченной задачи
export const isTaskOverdue = (
    task: Pick<Task, 'endDay' | 'type'>,
    now: Date = new Date()
): boolean => {
    if (task.type === 'done') return false;

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endTs = normalizeTimestamp(task.endDay);
    const endDate = new Date(endTs);
    const endDayStart = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
    ).getTime();

    return endDayStart < todayStart;
};