import React, {Component} from "react";
import ReactDOM from "react-dom";

import {AddSliderView} from './views/AddSliderView';
import {StudentDrawer} from './views/StudentDrawerView';
import {AddUserView} from "./views/AddUserView";
import {AddAssignmentView} from "./views/AddAssignmentView";

import {
    getData,
    getUsers,
    saveData,
    deleteSlider,
    addSlider,
    addUser,
    removeUser,
    getAssignments,
    addAssignment,
    removeAssignment,
    addStudent,
    removeStudent
} from "./actions/actions";

import "./styles.css";
import {AddStudentView} from "./views/AddStudentView";

const USER = "lmpotasi";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, users: {}, assignments: {}};
        this.getData = getData.bind(this);
        this.getUsers = getUsers.bind(this);
        this.saveData = saveData.bind(this);
        this.deleteSlider = deleteSlider.bind(this);
        this.addSlider = addSlider.bind(this);
        this.addUser = addUser.bind(this);
        this.removeUser = removeUser.bind(this);
        this.getAssignments = getAssignments.bind(this);
        this.addAssignment = addAssignment.bind(this);
        this.removeAssignment = removeAssignment.bind(this);
        this.addStudent = addStudent.bind(this);
        this.removeStudent = removeStudent.bind(this);
    }

    componentDidMount() {
        this.getAssignments(USER);
        this.getData(USER);
    }

    /**
     * toggleDrawer either opens or closes a given student drawer
     * @param {string} name - name of student's drawer
     * @param {boolean} isOpen - if the student's drawer was open before
     */
    toggleDrawer = ({assignment, student, isOpen}) => {
        const students = this.state.students;
        students[student][assignment].isOpen = !isOpen;
        this.setState({students});
        this.saveData();
    };

    /**
     * setUpSliderFunctions sets up onChange functions on all sliders and comment boxes
     */
    setUpSliderFunctions = (callback = () => {
    }) => {
        const newStudents = Object.keys(this.state.students).reduce(
            (acc, student) => {
                const newAssignments = Object.keys(this.state.assignments).reduce((acc, assignment) => {
                    if (!this.state.students[student][assignment]) return acc;
                    const theseSliders = this.state.students[student][assignment].sliders || {};
                    const newSliders = Object.keys(theseSliders).reduce(
                        (acc, slider) => ({
                            ...acc,
                            [slider]: {
                                ...theseSliders[slider],
                                id: slider,
                                // Creates an different onChange function for each slider on the screen
                                onChange: e => {
                                    const students = this.state.students;
                                    (students[student][assignment].sliders || {})[slider].value =
                                        e.target.value;
                                    this.setState({students}, this.saveData);
                                }
                            }
                        }),
                        {}
                    );
                    const comment = {
                        value: (this.state.students[student][assignment].comment || {}).value,
                        onChange: () => {
                        }
                    };
                    // Creates an different onChange function for each comment box on the screen
                    comment.onChange = e => {
                        const students = this.state.students;
                        (students[student][assignment].comment || {}).value = e.target.value;
                        this.setState({students}, this.saveData);
                    };
                    const newAssignment = {
                        ...this.state.students[student][assignment],
                        sliders: newSliders,
                        comment
                    };
                    return {
                        ...acc,
                        [assignment]: newAssignment
                    };
                }, {});
                const newStudent = {
                    ...this.state.students[student],
                    ...newAssignments,
                    name: student,
                };
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
            saved: true
        };
        this.setState(newState, callback);
        console.log(newState);
    };

    render() {
        const {students, user, users, assignments} = this.state;
        if (this.state.loading) {
            return (
                <div className="App">
                    <img src="https://www.my-bagfactory.com/layout/od_mybagfactory_v1/images/loading-sm.gif"/>
                    <button onClick={() => this.getData(USER)}>Load New Data</button>
                </div>
            );
        }

        const adminPage = (
            <React.Fragment>
                <h2>Admin Tools:</h2>
                <div className="adminPanel">
                    <h3>Assignments:</h3>
                    <div className="adminPanelContent">
                        {Object.keys(assignments).map((assignment) =>
                            <React.Fragment>
                                <div>
                                    <h4>{assignment}</h4>
                                    <button onClick={() => this.removeAssignment({user: USER, assignment})}>Remove
                                    </button>
                                </div>
                                <table>
                                    <tr>
                                        <th>Slider Name</th>
                                        <th>Min</th>
                                        <th>Max</th>
                                        <th>Default Value</th>
                                        <th>Step</th>
                                        <th>Extra Credit</th>
                                    </tr>
                                    {Object.values(assignments[assignment].sliders).map(s => (
                                        <tr>
                                            <th>{s.id}</th>
                                            <th>{s.min}</th>
                                            <th>{s.max}</th>
                                            <th>{s.value}</th>
                                            <th>{s.step || "1"}</th>
                                            <th>{s.isExtraCredit ? "Yes" : "No"}</th>
                                            <th>
                                                <button onClick={() => this.deleteSlider({
                                                    user: USER,
                                                    assignment,
                                                    slider: s.id
                                                })}>
                                                    Remove
                                                </button>
                                            </th>
                                        </tr>
                                    ))}
                                    <AddSliderView
                                        addSlider={(data) => this.addSlider({user: USER, assignment, data})}/>
                                </table>
                            </React.Fragment>
                        )}
                        <AddAssignmentView user={USER} addAssignment={this.addAssignment}/>
                    </div>
                </div>
                <div className="adminPanel">
                    <h3>Students</h3>
                    <div className="adminPanelContent adminStudents">
                        {Object.keys(students).map(student => (
                            <div>
                                <p>{student}</p>
                                <button onClick={() => this.removeStudent({user: USER, student})}>
                                    Remove
                                </button>
                            </div>
                        ))}
                        <AddStudentView user={USER} addStudent={this.addStudent}/>
                    </div>
                </div>
                <div className="adminPanel">
                    <h3>Users</h3>
                    <div className="adminPanelContent adminStudents">
                        {Object.keys(users).map(netId => (
                            <div>
                                <p>{netId}</p>
                                <button onClick={() => this.removeUser({user: USER, netId})}>
                                    Remove
                                </button>
                            </div>
                        ))}
                        <AddUserView user={USER} addUser={this.addUser}/>
                    </div>
                </div>
            </React.Fragment>
        );

        return (
            <div className="App">
                <nav>
                    <h1>
                        <strong>QuickGrade</strong> ║ {user.admin ? "Admin" : "User"}
                    </h1>
                    <p>Log Out</p>
                    <p>{USER}</p>
                    {this.state.saved ? (
                        <p className="saved">All changes Saved</p>
                    ) : (
                        <p className="saving">Saving changes...</p>
                    )}
                </nav>
                <div className="students">
                    {Object.values(students).map(student => (
                        Object.keys(assignments).map(assignment =>
                            student[assignment] ?
                                <StudentDrawer
                                    student={student}
                                    assignmentName={assignment}
                                    assignment={student[assignment]}
                                    isOpen={(student[assignment] || {}).isOpen}
                                    toggleDrawer={() => this.toggleDrawer({
                                        assignment,
                                        student: student.name,
                                        isOpen: (student[assignment] || {}).isOpen
                                    })}
                                /> : null
                        )
                    ))}
                </div>
                {user.admin ? adminPage : null}
            </div>
        );
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
