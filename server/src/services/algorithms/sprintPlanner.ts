export interface TaskNode {
    id: string;
    estimated_minutes: number;
    importance: number; // 1-10
    difficulty: 'easy' | 'medium' | 'hard';
    prerequisites: string[]; // Task IDs
}

export interface TaskPriorityNode {
    task: TaskNode;
    priority: { importance: number; difficultyLevel: number };
}

// Simple Priority Queue for Tasks
class TaskPriorityQueue {
    private items: TaskPriorityNode[] = [];

    // Importance (desc), then Difficulty (asc)
    public push(task: TaskNode) {
        const difficultyLevel = task.difficulty === 'easy' ? 1 : task.difficulty === 'medium' ? 2 : 3;
        this.items.push({ task, priority: { importance: task.importance, difficultyLevel } });
        this.items.sort((a, b) => {
            if (a.priority.importance !== b.priority.importance) {
                return b.priority.importance - a.priority.importance; // Descending
            }
            return a.priority.difficultyLevel - b.priority.difficultyLevel; // Ascending
        });
    }

    public pop(): TaskNode | undefined {
        return this.items.shift()?.task;
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }
}

export function generateSprintPlan(tasks: TaskNode[], weeklyHours: number) {
    const dailyMinutesCap = (weeklyHours * 60) / 7;
    const inDegree: Record<string, number> = {};
    const adjList: Record<string, string[]> = {};
    const taskMap: Record<string, TaskNode> = {};

    tasks.forEach(t => {
        inDegree[t.id] = 0;
        adjList[t.id] = [];
        taskMap[t.id] = t;
    });

    // Build Graph
    tasks.forEach(t => {
        t.prerequisites.forEach(prereq => {
            if (adjList[prereq]) {
                adjList[prereq].push(t.id);
            }
            if (inDegree[t.id] !== undefined) {
                inDegree[t.id]++;
            }
        });
    });

    const queue = new TaskPriorityQueue();
    for (const tId in inDegree) {
        if (inDegree[tId] === 0) {
            queue.push(taskMap[tId]);
        }
    }

    const sprintPlan: Record<number, TaskNode[]> = {};
    for (let day = 1; day <= 30; day++) {
        sprintPlan[day] = [];
    }

    let currDay = 1;
    let currDayMins = 0;
    let overloaded = false;
    let processedCount = 0;

    while (!queue.isEmpty()) {
        const task = queue.pop()!;
        processedCount++;

        // Move to next day if capacity exceeded
        if (currDayMins + task.estimated_minutes > dailyMinutesCap && currDayMins > 0) {
            currDay++;
            currDayMins = 0;
            if (currDay > 30) {
                overloaded = true;
                break;
            }
        }

        if (!sprintPlan[currDay]) sprintPlan[currDay] = [];
        sprintPlan[currDay].push(task);
        currDayMins += task.estimated_minutes;

        // Unlock neighbors
        adjList[task.id].forEach(neighbor => {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(taskMap[neighbor]);
            }
        });
    }

    // Cycle detection: If we didn't process all tasks and we aren't overloaded, there's a cycle
    if (processedCount < tasks.length && !overloaded) {
        throw new Error("Cycle detected in task dependencies!");
    }

    return { sprintPlan, overloaded };
}
