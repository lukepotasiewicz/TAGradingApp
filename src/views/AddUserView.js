import React, {useState} from "react";

/**
 * AddUserView holds the local state for the one input used to create a user
 * @param {string} user - currently logged in user
 * @param {function} addUser - this function is called when the user clicks add user
 * @returns {JSX}
 */
export const AddUserView = ({user, addUser}) => {
    const [netId, setNetId] = useState();
    const [isAdmin, setIsAdmin] = useState(false);
    return (
        <tr className="studentDrawerContent">
            <td>
                <input
                    type="text"
                    name="netId"
                    value={netId}
                    className="inputId"
                    placeholder="User netId"
                    onChange={e => setNetId(e.target.value)}
                />
            </td>
            <td>
                <input
                    type="checkbox"
                    name="isAdmin"
                    checked={isAdmin}
                    className="inputExtraCredit"
                    onChange={() => setIsAdmin(!isAdmin)}
                />
            </td>
            <button
                onClick={() => addUser({user, netId, isAdmin})}
            >
                Add User
            </button>
        </tr>
    );
};