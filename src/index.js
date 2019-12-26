import React, {Component, useState} from "react";
import ReactDOM from "react-dom";

import { AddSliderView } from './views/AddSliderView';
import { StudentDrawer } from './views/StudentDrawerView';

import { getData, getUsers, saveData, deleteSlider, addSlider } from "./actions/actions";

import "./styles.css";

const USER = "lmpotasi";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, users: {}};
        this.getData = getData.bind(this);
        this.getUsers = getUsers.bind(this);
        this.saveData = saveData.bind(this);
        this.deleteSlider = deleteSlider.bind(this);
        this.addSlider = addSlider.bind(this);
    }

    componentDidMount() {
        this.getData(USER);
    }

    /**
     * toggleDrawer either opens or closes a given student drawer
     * @param {string} name - name of student's drawer
     * @param {boolean} isOpen - if the student's drawer was open before
     */
    toggleDrawer = ({name, isOpen}) => {
        const students = this.state.students;
        students[name].isOpen = !isOpen;
        this.setState({students});
    };

    /**
     * setUpSliderFunctions sets up onChange functions on all sliders and comment boxes
     */
    setUpSliderFunctions = (callback = () => {}) => {
        const newStudents = Object.keys(this.state.students).reduce(
            (acc, student) => {
                const theseSliders = this.state.students[student].sliders || {};
                const newSliders = Object.keys(theseSliders).reduce(
                    (acc, slider) => ({
                        ...acc,
                        [slider]: {
                            ...theseSliders[slider],
                            id: slider,
                            // Creates an different onChange function for each slider on the screen
                            onChange: e => {
                                const students = this.state.students;
                                (students[student].sliders || {})[slider].value =
                                    e.target.value;
                                this.setState({students}, this.saveData);
                            }
                        }
                    }),
                    {}
                );
                const comment = {
                    value: (this.state.students[student].comment || {}).value,
                    onChange: () => {
                    }
                };
                // Creates an different onChange function for each comment box on the screen
                comment.onChange = e => {
                    const students = this.state.students;
                    (students[student].comment || {}).value = e.target.value;
                    this.setState({students}, this.saveData);
                };
                const newStudent = {
                    ...this.state.students[student],
                    name: student,
                    sliders: newSliders,
                    comment
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
    };

    render() {
        const {students, user, users} = this.state;
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
                <div className="adminPannel">
                    <h3>Assignments:</h3>
                    <div className="adminPannelContent">
                        <table>
                            <tr>
                                <th>Slider Name</th>
                                <th>Min</th>
                                <th>Max</th>
                                <th>Default Value</th>
                                <th>Step</th>
                                <th>Extra Credit</th>
                            </tr>
                            {Object.values(
                                this.state.students[Object.keys(students)[0]].sliders
                            ).map(s => (
                                <tr>
                                    <th>{s.id}</th>
                                    <th>{s.min}</th>
                                    <th>{s.max}</th>
                                    <th>{s.value}</th>
                                    <th>{s.step || "1"}</th>
                                    <th>{s.isExtraCredit ? "Yes" : "No"}</th>
                                    <th>
                                        <button onClick={() => this.deleteSlider(s.id)}>
                                            Remove
                                        </button>
                                    </th>
                                </tr>
                            ))}
                            <AddSliderView addSlider={this.addSlider}/>
                        </table>
                        <button>Add Assignment</button>
                    </div>
                </div>
                <div className="adminPannel">
                    <h3>Students</h3>
                    <div className="adminPannelContent adminStudetns">
                        {Object.keys(students).map(studentName => (
                            <div>
                                <p>{studentName}</p>
                                <button>Remove</button>
                            </div>
                        ))}
                        <button>Add Student</button>
                    </div>
                </div>
                <div className="adminPannel">
                    <h3>Graders</h3>
                    <div className="adminPannelContent adminStudetns">
                        {Object.keys(users).map(studentName => (
                            <div>
                                <p>{studentName}</p>
                                <button>Remove</button>
                            </div>
                        ))}
                        <button>Add Grader</button>
                    </div>
                </div>
            </React.Fragment>
        );

        return (
            <div className="App">
                <nav>
                    <h1>
                        <strong>QuickGrade</strong> ║ {user.admin ? "Admin" : "Grader"}
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
                    {Object.keys(students).map(studentName => (
                        <StudentDrawer
                            student={this.state.students[studentName]}
                            isOpen={(this.state.students[studentName] || {}).isOpen}
                            toggleDrawer={this.toggleDrawer}
                        />
                    ))}
                </div>
                {user.admin ? adminPage : null}
            </div>
        );
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
