import React, {useState} from "react";

export const AddUserView = ({user, addUser}) => {
    const [netId, setNetId] = useState();
    const [isAdmin, setIsAdmin] = useState(false);
    return (
        <tr className="studentDrawerContent">
            <th>
                <input
                    type="text"
                    name="netId"
                    value={netId}
                    className="inputId"
                    placeholder="User netId"
                    onChange={e => setNetId(e.target.value)}
                />
            </th>
            <th>
                <input
                    type="checkbox"
                    name="isAdmin"
                    checked={isAdmin}
                    className="inputExtraCredit"
                    onChange={() => setIsAdmin(!isAdmin)}
                />
            </th>
            <button
                onClick={() => addUser({user, netId, isAdmin})}
            >
                Add User
            </button>
        </tr>
    );
};