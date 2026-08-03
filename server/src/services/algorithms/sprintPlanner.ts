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

class TaskPriorityQueue {
    private items: TaskPriorityNode[] = [];

    // Importance (desc), then Difficulty (asc)
    private compare(a: TaskPriorityNode, b: TaskPriorityNode): number {
        if (a.priority.importance !== b.priority.importance) {
            return b.priority.importance - a.priority.importance; // Descending
        }
        return a.priority.difficultyLevel - b.priority.difficultyLevel; // Ascending
    }

    public push(task: TaskNode) {
        const difficultyLevel = task.difficulty === 'easy' ? 1 : task.difficulty === 'medium' ? 2 : 3;
        const node: TaskPriorityNode = { task, priority: { importance: task.importance, difficultyLevel } };
        
        this.items.push(node);
        this.bubbleUp(this.items.length - 1);
    }

    public pop(): TaskNode | undefined {
        if (this.isEmpty()) return undefined;
        if (this.items.length === 1) return this.items.pop()?.task;
        
        const top = this.items[0];
        this.items[0] = this.items.pop()!;
        this.bubbleDown(0);
        return top.task;
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    private bubbleUp(index: number) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.compare(this.items[parentIndex], this.items[index]) <= 0) break;
            
            // Swap
            [this.items[parentIndex], this.items[index]] = [this.items[index], this.items[parentIndex]];
            index = parentIndex;
        }
    }

    private bubbleDown(index: number) {
        const length = this.items.length;
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let smallest = index;

            if (leftChildIndex < length && this.compare(this.items[leftChildIndex], this.items[smallest]) < 0) {
                smallest = leftChildIndex;
            }

            if (rightChildIndex < length && this.compare(this.items[rightChildIndex], this.items[smallest]) < 0) {
                smallest = rightChildIndex;
            }

            if (smallest === index) break;

            // Swap
            [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
            index = smallest;
        }
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
