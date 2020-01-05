import React, {useState} from "react";

/**
 * GradeSlider is an html slider element in a table row
 * @param {object} slider - holds necessary params for a slider (min, max, value, step, onChange)
 * @returns {JSX}
 */
const GradeSlider = ({slider}) => (
    <tr className="gradeSlider">
        <th className="sliderId">{slider.id}</th>
        <input type="range" {...slider} className="slider"/>
        <th className="sliderValue">{slider.value}</th>
    </tr>
);

/**
 * StudentDrawer includes the ui for a given student's name, grade, and sliders for their grades
 * @param {string} student - student name/id
 * @param {object} assignment - assignment object from state/server
 * @param {string} assignmentName - assignment name/id
 * @param {function} toggleDrawer - this is called when user wants to open or close this drawer
 * @param {boolean} isOpen - true if this drawer should be open
 * @returns {JSX}
 */
export const StudentDrawer = ({student, assignment, assignmentName, toggleDrawer, isOpen}) => {
    const [height, setHeight] = useState("");
    let total = 0;
    let max = 0;
    const sliders = Object.values(assignment.sliders).map(slider => {
        total += parseFloat(slider.value);
        // extra credit does not count toward the max grade in a category
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
                    // -3 is a hack fixing a bug with the height of the student drawer
                    setHeight(e.scrollHeight - 3);
                }
            }}
        >
            <div
                className="studentDrawerHeader"
                onClick={toggleDrawer}
            >
                <h2>{assignmentName + ": " + student.name}</h2>
                <p>{total + "/" + max}</p>
            </div>
            <div className="studentDrawerContent">
                <table className="leftPanel">{sliders}</table>
                <table className="rightPanel">
                    <h3>Comments</h3>
                    <textarea {...assignment.comment} />
                </table>
            </div>
        </div>
    );
};
