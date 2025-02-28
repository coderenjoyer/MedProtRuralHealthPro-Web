import React from 'react';

function PatientSearch() {
    return (
        <div className="patient-search">
            <h2 className="search-header">Patient Search</h2>
            
            <div className="search-box">
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Search patient..."
                />
                <button className="search-button">
                    Search
                </button>
            </div>

            <div className="search-results">
                <table className="patients-table">
                    <thead>
                        <tr>
                            <th>Patient No.</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>001</td>
                            <td>John Doe</td>
                            <td>
                                <button className="view-btn">View</button>
                            </td>
                        </tr>
                        {/* Sample data rows */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PatientSearch;