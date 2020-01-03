import React, {useState} from "react";

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