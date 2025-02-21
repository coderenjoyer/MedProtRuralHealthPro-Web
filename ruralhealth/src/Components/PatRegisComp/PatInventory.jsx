import React from 'react';
import { Search } from 'lucide-react';

function ManageInventory() {
    return (
        <div className="inventory-container">
            {/* Left side - existing medicine management */}
            <div className="medicine-management">
                <div className="header-section">
                    <h2 className="section-title">Medicine Management</h2>
                    <div className="medicine-id">
                        <label>Medicine ID</label>
                        <input type="text" className="form-control" disabled />
                    </div>
                </div>

                <div className="medicine-form">
                    <div className="form-group">
                        <label>Medicine Name</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Medicine Brand</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Medicine Description</label>
                        <textarea className="form-control" rows="3"></textarea>
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Medicine Expiry</label>
                        <input type="date" className="form-control" />
                    </div>

                    <div className="button-group">
                        <button className="btn add-btn">Add Medicine</button>
                        <button className="btn update-btn">Update Stock</button>
                        <button className="btn remove-btn">Remove Stock</button>
                    </div>
                </div>
            </div>

            {/* Right side - medicine search and table */}
            <div className="medicine-list">
                <div className="search-section">
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Search medicine..." 
                            className="search-input"
                        />
                        <button className="search-button">
                            <Search size={20} />
                            Search
                        </button>
                    </div>
                </div>

                <div className="table-section">
                    <table className="medicine-table">
                        <thead>
                            <tr>
                                <th>Medicine ID</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Quantity</th>
                                <th>Expiry Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>MED001</td>
                                <td>Paracetamol</td>
                                <td>Biogesic</td>
                                <td>100</td>
                                <td>2025-12-31</td>
                                <td>
                                    <button className="action-btn">Select</button>
                                </td>
                            </tr>
                            {/* Add more sample rows as needed */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageInventory;