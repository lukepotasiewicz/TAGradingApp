/**
 *
 * @param {string} endpoint - api endpoint to call
 * @param {string} queryString - fully formed query string, without ? ("user=test&foo=bar")
 * @param {function} onSuccess - this function is called after the request responds,
 *                               passing the parsed json in the first param
 */
function apiInteraction({endpoint, queryString, onSuccess}) {
    const Http = new XMLHttpRequest();
    const url =
        "https://lmpotasi.w3.uvm.edu/proxyserver/" + endpoint + "?" + queryString;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const data = JSON.parse(Http.responseText);
            onSuccess(data);
        }
    };
}

/**
 * API ACTIONS
 * All functions have a corresponding function in the express server on silk.
 * For jsdoc, please refer to the server's js
 */


export function saveData(user) {
    this.setState({saved: false});
    // clear previous save data delay
    clearTimeout(this.state.saveDataTimeoutId);
    // wait 1000ms before saving data
    const saveDataTimeoutId = setTimeout(() => {
        const data = { students: this.state.students };

        apiInteraction({
            endpoint: "updateData", queryString: "user=" + user + "&data=" + JSON.stringify(data), onSuccess: (data) => {
                this.setState({saved: true});
            }
        });
    }, 1000);
    // update the timeoutId for saveData, so if saveData is called in the next 1000ms, the previous call will be canceled.
    this.setState({saveDataTimeoutId});
}

export function getData(user) {
    apiInteraction({
        endpoint: "getData", queryString: "user=" + user, onSuccess: (data) => {
            this.setState({students: data.students, user: data.user}, this.setUpSliderFunctions);
            // also get all user information
            this.getUsers(user);
        }
    });
}

export function getUsers(user) {
    this.setState({loading: false});
    apiInteraction({
        endpoint: "getAllUsers", queryString: "user=" + user, onSuccess: (users) => {
            this.setState({users});
        }
    });
}

export function addUser({user, netId, isAdmin}) {
    this.setState({saved: false});
    apiInteraction({
        endpoint: "addUser",
        queryString: "user=" + user + "&netId=" + netId + "&admin=" + isAdmin,
        onSuccess: () => {
            this.getUsers(user);
            this.setState({saved: true});
        }
    });
}

export function removeUser ({user, netId}) {
    this.setState({saved: false});
    apiInteraction({
        endpoint: "deleteUser",
        queryString: "user=" + user + "&netId=" + netId,
        onSuccess: (resp) => {
            this.getUsers(user);
            this.setState({saved: true});
        }
    });
}

export function addAssignment({user, assignment}) {
    this.setState({saved: false});
    apiInteraction({
        endpoint: "addAssignment",
        queryString: "user=" + user + "&assignment=" + assignment,
        onSuccess: (resp) => {
            this.getAssignments(user);
            this.setState({saved: true});
        }
    });
}

export function getAssignments(user) {
    apiInteraction({
        endpoint: "getAssignments",
        queryString: "user=" + user,
        onSuccess: (assignments) => {
            this.setState({assignments});
        }
    });
}

export function removeAssignment ({user, assignment}) {
    this.setState({saved: false});
    apiInteraction({
        endpoint: "deleteAssignment",
        queryString: "user=" + user + "&assignment=" + assignment,
        onSuccess: (resp) => {
            this.getAssignments(user);
            this.setState({saved: true});
        }
    });
}

export function addStudent({user, student}) {
    this.setState({saved: false});
    apiInteraction({
        endpoint: "addStudent",
        queryString: "user=" + user + "&student=" + student,
        onSuccess: (resp) => {
            this.getData(user);
            this.setState({saved: true});
        }
    });
}

export function removeStudent ({user, student}) {
    this.setState({saved: false});
    apiInteraction({
        endpoint: "deleteStudent",
        queryString: "user=" + user + "&student=" + student,
        onSuccess: (resp) => {
            this.getData(user);
            this.setState({saved: true});
        }
    });
}

export function addSlider({user, assignment, data}) {
    this.setState({saved: false});
    apiInteraction({
        endpoint: "addSlider",
        queryString: "user=" + user + "&assignment=" + assignment + "&data=" + JSON.stringify(data),
        onSuccess: (resp) => {
            this.getAssignments(user);
            this.getData(user);
            this.setState({saved: true});
        }
    });
}

export function deleteSlider({user, assignment, slider}) {
    this.setState({saved: false});
    apiInteraction({
        endpoint: "deleteSlider",
        queryString: "user=" + user + "&assignment=" + assignment + "&slider=" + slider,
        onSuccess: (resp) => {
            this.getAssignments(user);
            this.setState({saved: true});
        }
    });
}

export function updateAssignmentGrader({user, assignment, student, grader}) {
    this.setState({saved: false});
    apiInteraction({
        endpoint: "updateAssignmentGrader",
        queryString: "user=" + user + "&assignment=" + assignment + "&student=" + student + "&grader=" + grader,
        onSuccess: (resp) => {
            this.getAssignments(user);
            this.getData(user);
            this.setState({saved: true});
        }
    });
}