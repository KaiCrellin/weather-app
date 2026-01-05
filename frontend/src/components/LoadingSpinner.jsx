import '../style/LoadingSpinner.css';




function LoadingSpinner({show, message = 'Loading...', overlay = false}) {
    // if a property using LoadingSpinner does not have show={true}
    //it will not work
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
// Export LoadingSpinner
export default LoadingSpinner;