import React, {useState} from "react";

/**
 * AddStudentView holds the local state of all inputs and checkboxes for creating a student
 * @param {string} user - currently logged in user
 * @param {function} addStudent - this function is called when the user clicks add student
 * @returns {JSX}
 */
export const AddStudentView = ({user, addStudent}) => {
    const [student, setStudent] = useState();
    return (
        <tr className="studentDrawerContent">
            <td>
                <input
                    type="text"
                    name="student"
                    value={student}
                    className="inputId"
                    placeholder="Student Name"
                    onChange={e => setStudent(e.target.value)}
                />
            </td>
            <button
                onClick={() => addStudent({user, student})}
            >
                Add Student
            </button>
        </tr>
    );
};