import React, {useState} from "react";


/**
 * AddAssignment holds the local state for the one input used to create an assignment
 * @param {string} user - currently logged in user
 * @param {function} addAssignment - this function is called when the user clicks add assignment
 * @returns {JSX}
 */
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