import React, { useState, useEffect } from 'react';

function LocalStorageDisplay() {
    const [localStorageData, setLocalStorageData] = useState({});

    useEffect(() => {
        const updateLocalStorageData = () => {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = localStorage.getItem(key);
            }
            setLocalStorageData(data);
        };

        // Update local storage data initially and set up a listener for changes
        updateLocalStorageData();
        window.addEventListener('storage', updateLocalStorageData);

        // Cleanup the listener
        return () => {
            window.removeEventListener('storage', updateLocalStorageData);
        };
    }, []);

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', maxHeight: '200px', overflowY: 'auto', width: '300px', backgroundColor: '#f7f7f7', borderRadius: '5px' }}>
            <h3>Local Storage Data:</h3>
            <ul>
                {Object.entries(localStorageData).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LocalStorageDisplay;
