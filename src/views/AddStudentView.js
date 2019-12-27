import React, {useState} from "react";

export const AddStudentView = ({user, addStudent}) => {
    const [student, setStudent] = useState();
    return (
        <tr className="studentDrawerContent">
            <th>
                <input
                    type="text"
                    name="student"
                    value={student}
                    className="inputId"
                    placeholder="Student Name"
                    onChange={e => setStudent(e.target.value)}
                />
            </th>
            <button
                onClick={() => addStudent({user, student})}
            >
                Add Student
            </button>
        </tr>
    );
};