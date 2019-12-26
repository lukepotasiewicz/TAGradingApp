import React, {Component, useState} from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const USER = "lmpotasi";

const GradeSlider = ({slider}) => (
    <tr className="gradeSlider">
        <th className="sliderId">{slider.id}</th>
        <input type="range" {...slider} className="slider"/>
        <th className="sliderValue">{slider.value}</th>
    </tr>
);

const AddSliderView = ({addSlider}) => {
    const [id, setId] = useState();
    const [min, setMin] = useState();
    const [max, setMax] = useState();
    const [value, setValue] = useState();
    const [step, setStep] = useState();
    const [isExtraCredit, setIsExtraCredit] = useState(false);
    return (
        <tr className="studentDrawerContent">
            <th>
                <input
                    type="text"
                    name="newSliderName"
                    value={id}
                    className="inputId"
                    placeholder="Slider name"
                    onChange={e => setId(e.target.value)}
                />
            </th>
            <th>
                <input
                    type="text"
                    name="newSliderMin"
                    value={min}
                    className="inputMin"
                    placeholder="min"
                    onChange={e =>
                        isNaN(e.target.value) ? null : setMin(e.target.value)
                    }
                />
            </th>
            <th>
                <input
                    type="text"
                    name="newSliderMax"
                    value={max}
                    className="inputMax"
                    placeholder="max"
                    onChange={e =>
                        isNaN(e.target.value) ? null : setMax(e.target.value)
                    }
                />
            </th>
            <th>
                <input
                    type="text"
                    name="newSliderValue"
                    value={value}
                    className="inputValue"
                    placeholder="default value"
                    onChange={e =>
                        isNaN(e.target.value) ? null : setValue(e.target.value)
                    }
                />
            </th>
            <th>
                <input
                    type="text"
                    name="newSliderStep"
                    value={step}
                    className="inputStep"
                    placeholder="step"
                    onChange={e => setStep(e.target.value)}
                />
            </th>
            <th>
                <input
                    type="checkbox"
                    name="newSliderExtraCredit"
                    checked={isExtraCredit}
                    className="inputExtraCredit"
                    onChange={() => setIsExtraCredit(!isExtraCredit)}
                />
            </th>
            <button
                onClick={() => addSlider({id, min, max, value, isExtraCredit, step})}
            >
                Add Slider
            </button>
        </tr>
    );
};

/**
 * StudentDrawer includes the ui for a given student's name, grade, and sliders for their grades
 */
const StudentDrawer = ({student, toggleDrawer, isOpen}) => {
    const [height, setHeight] = useState("");
    let total = 0;
    let max = 0;
    const sliders = Object.values(student.sliders).map(slider => {
        total += parseFloat(slider.value);
        // extra credit does not count tward the max grade in a catagory
        if (!slider.isExtraCredit) {
            max += parseFloat(slider.max);
        }
        return <GradeSlider slider={slider}/>;
    });
    return (
        <div
            className={`${isOpen ? "open" : ""} studentDrawer`}
            style={{height: isOpen ? height : "38px"}}
            ref={e => {
                if (e) {
                    // -10 is a hack fixing a bug with the height of the student drawer
                    setHeight(e.scrollHeight - 3);
                }
            }}
        >
            <div
                className="studentDrawerHeader"
                onClick={() => toggleDrawer({name: student.name, isOpen})}
            >
                <h2>{student.name}</h2>
                <p>{total + "/" + max}</p>
            </div>
            <div className="studentDrawerContent">
                <table className="leftPannel">{sliders}</table>
                <table className="rightPannel">
                    <h3>Comments</h3>
                    <textarea {...student.comment} />
                </table>
            </div>
        </div>
    );
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, users: {}};
    }

    componentDidMount() {
        this.getData();
    }

    toggleDrawer = ({name, isOpen}) => {
        const students = this.state.students;
        students[name].isOpen = !isOpen;
        this.setState({students});
    };

    /**
     * setUpSliderFunctions sets up onChange functions on all sliders and comment boxes
     */
    setUpSliderFunctions = (callback = () => {
    }) => {
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

    getData = () => {
        const classThis = this;
        classThis.setState({loading: true});
        const Http = new XMLHttpRequest();
        const url = "https://lmpotasi.w3.uvm.edu/proxyserver/getData?user=" + USER;
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const tempState = JSON.parse(Http.responseText);
                classThis.setState(tempState, classThis.setUpSliderFunctions);
                classThis.getUsers();
            }
        };
    };

    getUsers = () => {
        const classThis = this;
        classThis.setState({loading: true});
        const Http = new XMLHttpRequest();
        const url =
            "https://lmpotasi.w3.uvm.edu/proxyserver/getAllUsers?user=" + USER;
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const users = JSON.parse(Http.responseText);
                classThis.setState({users});
                classThis.setState({loading: false});
            }
        };
    };

    saveData = () => {
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
    };

    addSlider = newSlider => {
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
    };

    deleteSlider = target => {
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
    };

    render() {
        const {students, user, users} = this.state;
        if (this.state.loading) {
            return (
                <div className="App">
                    <img src="https://www.my-bagfactory.com/layout/od_mybagfactory_v1/images/loading-sm.gif"/>
                    <button onClick={this.getData}>Load New Data</button>
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
