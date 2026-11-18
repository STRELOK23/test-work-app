import { isTaskOverdue } from './dateUtils';

describe('isTaskOverdue', () => {
    const mockNow = new Date(2025, 0, 25); // 25.01.2025

    test('возвращает true, если дедлайн меньше сегодняшней даты и статус не done', () => {
        const endDay = new Date(2025, 0, 20).getTime();
        expect(isTaskOverdue({ endDay, type: 'in_progress' }, mockNow)).toBe(true);
    });

    test('возвращает false для задач в статусе done, даже если дата прошла', () => {
        const endDay = new Date(2025, 0, 20).getTime();
        expect(isTaskOverdue({ endDay, type: 'done' }, mockNow)).toBe(false);
    });

    test('возвращает false, если дедлайн сегодня или в будущем', () => {
        const today = new Date(2025, 0, 25).getTime();
        const future = new Date(2025, 0, 30).getTime();
        expect(isTaskOverdue({ endDay: today, type: 'todo' }, mockNow)).toBe(false);
        expect(isTaskOverdue({ endDay: future, type: 'review' }, mockNow)).toBe(false);
    });
});