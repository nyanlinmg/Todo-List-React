const  api = "http://localhost:8800";

export const deleteTask = async (id) => {
    const res = await fetch(`${api}/deleteTask/${id}`, {
        method: 'DELETE'
    });

    if(!res.ok) {
        const error = await res.json();
        throw new Error("Failed to delete task");
    }

    return await res.json();
}

export const showTasks = async () => {
    const res = await fetch(`${api}/tasks`, {
        method: 'GET'
    });

    if(!res.ok) {
        const error = await res.json();
        throw new Error("Failed to fetch tasks");
    }

    return await res.json();
}

export const showCategories = async () => {
    const res = await fetch(`${api}/categories`, {
        method: 'GET'
    });

    if(!res.ok) {
        const error = await res.json();
        throw new Error("Failed to fetch categories");
    }

    return await res.json();
}