import { useParams } from "react-router-dom";

export default function Category() {
    const { id } = useParams();

    return (
        <div>
            Category id : {id}
        </div>
    )
}