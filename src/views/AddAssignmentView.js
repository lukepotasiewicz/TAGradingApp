import React, {useState} from "react";

export const AddAssignmentView = ({user, addAssignment}) => {
    const [assignment, setAssignment] = useState();
    return (
        <tr className="studentDrawerContent">
            <td>
                <input
                    type="text"
                    name="name"
                    value={assignment}
                    className="inputId"
                    placeholder="Assignment Name"
                    onChange={e => setAssignment(e.target.value)}
                />
            </td>
            <button
                onClick={() => addAssignment({user, assignment})}
            >
                Add Assignment
            </button>
        </tr>
    );
};