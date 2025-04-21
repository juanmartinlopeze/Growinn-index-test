import React from "react";
import './ToolTip.css';

export const Tooltip = ({ triggerText, popupText }) => {
    return (
        <div className="popup">
            {triggerText}
            <span className="popuptext">{popupText}</span>
        </div>
    );
};
