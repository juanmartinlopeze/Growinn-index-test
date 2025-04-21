import './DownloadButton.css';

export function DownloadButton({ text, onClick }) {
return (
    <button className="download-button" onClick={onClick}>
            <img 
                src="../../../../public/arrow-left.png" 
                style={{ transform: 'rotate(-90deg)' }} 
            />
        {text}
    </button>
);
}