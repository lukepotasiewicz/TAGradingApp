// API actions
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

export function saveData() {
    this.setState({saved: false});
    clearTimeout(this.state.saveDataTimeoutId);
    const saveDataTimeoutId = setTimeout(() => {
        const data = { students: this.state.students };

        apiInteraction({
            endpoint: "updateData", queryString: "data=" + JSON.stringify(data), onSuccess: (data) => {
                this.setState({saved: true});
            }
        });
    }, 1000);
    this.setState({saveDataTimeoutId});
}

export function getData(user) {
    apiInteraction({
        endpoint: "getData", queryString: "user=" + user, onSuccess: (data) => {
            this.setState({students: data.students, user: data.user}, this.setUpSliderFunctions);
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
        onSuccess: (resp) => {
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