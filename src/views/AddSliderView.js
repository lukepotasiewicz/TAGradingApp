import React, {useState} from "react";

export const AddSliderView = ({addSlider}) => {
    const [id, setId] = useState();
    const [min, setMin] = useState();
    const [max, setMax] = useState();
    const [value, setValue] = useState();
    const [step, setStep] = useState();
    const [isExtraCredit, setIsExtraCredit] = useState(false);
    return (
        <tr className="studentDrawerContent">
            <td>
                <input
                    type="text"
                    name="newSliderName"
                    value={id}
                    className="inputId"
                    placeholder="Slider name"
                    onChange={e => setId(e.target.value)}
                />
            </td>
            <td>
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
            </td>
            <td>
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
            </td>
            <td>
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
            </td>
            <td>
                <input
                    type="text"
                    name="newSliderStep"
                    value={step}
                    className="inputStep"
                    placeholder="step"
                    onChange={e => setStep(e.target.value)}
                />
            </td>
            <td>
                <input
                    type="checkbox"
                    name="newSliderExtraCredit"
                    checked={isExtraCredit}
                    className="inputExtraCredit"
                    onChange={() => setIsExtraCredit(!isExtraCredit)}
                />
            </td>
            <button
                onClick={() => addSlider({id, min, max, value, isExtraCredit, step})}
            >
                Add Slider
            </button>
        </tr>
    );
};