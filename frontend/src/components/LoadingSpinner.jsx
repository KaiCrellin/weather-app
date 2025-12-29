import '../components/LoadingSpinner.css';




function LoadingSpinner({show, message = 'Loading...', overlay = false}) {
    if (!show) return null;



    return (
        <>
            {overlay && <div className="spinner-overlay"/>}
            <div className={`loading-spinner ${overlay ? 'spinner-centered' : ''}`}>
                <div className="spinner"></div>
                {message && <p className="spinner-message">{message}</p>}
            </div>
        </>
    );
}

export default LoadingSpinner;