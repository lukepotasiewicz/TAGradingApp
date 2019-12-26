// API actions

export function getData (user) {
    const classThis = this;
    classThis.setState({loading: true});
    const Http = new XMLHttpRequest();
    const url = "https://lmpotasi.w3.uvm.edu/proxyserver/getData?user=" + user;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const tempState = JSON.parse(Http.responseText);
            classThis.setState(tempState, classThis.setUpSliderFunctions);
            classThis.getUsers(user);
        }
    };
}

export function getUsers (user) {
    const classThis = this;
    classThis.setState({loading: true});
    const Http = new XMLHttpRequest();
    const url =
        "https://lmpotasi.w3.uvm.edu/proxyserver/getAllUsers?user=" + user;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const users = JSON.parse(Http.responseText);
            classThis.setState({users});
            classThis.setState({loading: false});
        }
    };
}

export function saveData () {
    const classThis = this;
    classThis.setState({saved: false});
    clearTimeout(this.state.saveDataTimeoutId);
    const saveDataTimeoutId = setTimeout(() => {
        const Http = new XMLHttpRequest();
        const url =
            "https://lmpotasi.w3.uvm.edu/proxyserver/updateData?data=" +
            JSON.stringify(this.state);
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                classThis.setState({saved: true});
            }
        };
    }, 1000);
    this.setState({saveDataTimeoutId});
}

// State actions

export function addSlider (newSlider) {
    const newStudents = Object.keys(this.state.students).reduce(
        (acc, student) => {
            const newStudent = {
                ...this.state.students[student]
            };
            newStudent.sliders[newSlider.id] = newSlider;
            return {
                ...acc,
                [student]: newStudent
            };
        },
        {}
    );
    const newState = {
        ...this.state,
        students: newStudents,
        loading: false
    };
    this.setState(newState, () => this.setUpSliderFunctions(this.saveData));
}

export function deleteSlider (target) {
    const newStudents = Object.keys(this.state.students).reduce(
        (acc, student) => {
            const newStudent = {
                ...this.state.students[student]
            };
            Reflect.deleteProperty(newStudent.sliders, target);
            return {
                ...acc,
                [student]: newStudent
            };
        },
        {}
    );
    const newState = {
        ...this.state,
        students: newStudents,
        loading: false
    };
    this.setState(newState, this.saveData);
}