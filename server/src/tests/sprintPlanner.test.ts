import { describe, it, expect } from '@jest/globals';
import { generateSprintPlan, TaskNode } from '../services/algorithms/sprintPlanner.js';

describe('Sprint Planner DAG Algorithm Tests', () => {
  it('should plan independent tasks on day 1 if under cap', () => {
    const tasks: TaskNode[] = [
      { id: '1', estimated_minutes: 30, importance: 8, difficulty: 'easy', prerequisites: [] },
      { id: '2', estimated_minutes: 40, importance: 9, difficulty: 'easy', prerequisites: [] }
    ];
    // Weekly hours = 10 -> daily cap = 10 * 60 / 7 = 85.7 minutes
    const { sprintPlan, overloaded } = generateSprintPlan(tasks, 10);
    expect(overloaded).toBe(false);
    expect(sprintPlan[1]).toHaveLength(2);
    // Task 2 should be first because importance is higher (9 vs 8)
    expect(sprintPlan[1][0].id).toBe('2');
    expect(sprintPlan[1][1].id).toBe('1');
  });

  it('should respect dependencies', () => {
    const tasks: TaskNode[] = [
      { id: '1', estimated_minutes: 30, importance: 9, difficulty: 'easy', prerequisites: ['2'] },
      { id: '2', estimated_minutes: 40, importance: 8, difficulty: 'easy', prerequisites: [] }
    ];
    const { sprintPlan, overloaded } = generateSprintPlan(tasks, 10);
    expect(overloaded).toBe(false);
    // Even though Task 1 has higher importance (9 vs 8), it depends on Task 2.
    // So Task 2 must be scheduled before Task 1.
    expect(sprintPlan[1][0].id).toBe('2');
    expect(sprintPlan[1][1].id).toBe('1');
  });

  it('should distribute tasks across days when cap is exceeded', () => {
    const tasks: TaskNode[] = [
      { id: '1', estimated_minutes: 60, importance: 8, difficulty: 'easy', prerequisites: [] },
      { id: '2', estimated_minutes: 60, importance: 7, difficulty: 'easy', prerequisites: [] }
    ];
    // Weekly hours = 7 -> daily cap = 60 minutes
    const { sprintPlan, overloaded } = generateSprintPlan(tasks, 7);
    expect(overloaded).toBe(false);
    expect(sprintPlan[1]).toHaveLength(1);
    expect(sprintPlan[2]).toHaveLength(1);
    expect(sprintPlan[1][0].id).toBe('1');
    expect(sprintPlan[2][0].id).toBe('2');
  });

  it('should throw an error when cycle is detected', () => {
    const tasks: TaskNode[] = [
      { id: '1', estimated_minutes: 30, importance: 8, difficulty: 'easy', prerequisites: ['2'] },
      { id: '2', estimated_minutes: 40, importance: 9, difficulty: 'easy', prerequisites: ['1'] }
    ];
    expect(() => {
      generateSprintPlan(tasks, 10);
    }).toThrow('Cycle detected in task dependencies!');
  });
});
