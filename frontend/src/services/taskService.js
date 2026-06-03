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