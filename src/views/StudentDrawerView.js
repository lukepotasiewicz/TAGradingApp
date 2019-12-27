import React, {useState} from "react";

const GradeSlider = ({slider}) => (
    <tr className="gradeSlider">
        <th className="sliderId">{slider.id}</th>
        <input type="range" {...slider} className="slider"/>
        <th className="sliderValue">{slider.value}</th>
    </tr>
);

/**
 * StudentDrawer includes the ui for a given student's name, grade, and sliders for their grades
 */
export const StudentDrawer = ({student, assignment, assignmentName, toggleDrawer, isOpen}) => {
    const [height, setHeight] = useState("");
    let total = 0;
    let max = 0;
    const sliders = Object.values(assignment.sliders).map(slider => {
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
                onClick={toggleDrawer}
            >
                <h2>{student.name + ": " + assignmentName}</h2>
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
