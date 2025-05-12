import React from "react";
import './ToolTip.css';

export const Tooltip = ({ triggerText, popupText }) => {
    return (
        <div className="popup">
            <div>
                {triggerText}
            </div>
            <span className="popuptext">{popupText}</span>
        </div>
    );
};
