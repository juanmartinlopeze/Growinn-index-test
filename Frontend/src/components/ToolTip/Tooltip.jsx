import React from "react";
import './Tooltip.css';

export const Tooltip = ({ triggerText, popupText }) => {
    return (
        <div className="popup">
            {triggerText}
            <span className="popuptext">{popupText}</span>
        </div>
    );
};
