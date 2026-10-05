import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import api from "../services/api";
import "../styles/StaffManagement.css";

function StaffManagement() {

    const navigate = useNavigate();

    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Delete confirmation
    const [staffToDelete, setStaffToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [newStaff, setNewStaff] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        location: "",
        role: "STAFF"
    });

    // Load all staff
    const loadStaff = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/api/staff");

            setStaffList(response.data);

        } catch (error) {

            console.error("Load staff error:", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to load staff members"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadStaff();
    }, []);

    // Handle form changes
    const handleChange = (event) => {

        setNewStaff({
            ...newStaff,
            [event.target.name]: event.target.value
        });
    };

    // Create / Update staff
    const handleCreateStaff = async (event) => {

        event.preventDefault();

        setError("");
        setSuccessMessage("");
        setSaving(true);

        try {

            if (editingStaff) {

                await api.put(
                    `/api/staff/${editingStaff.id}`,
                    newStaff
                );

            } else {

                await api.post(
                    "/api/staff",
                    newStaff
                );
            }

            setSuccessMessage(
                editingStaff
                    ? "Staff member updated successfully!"
                    : "Staff member created successfully!"
            );

            setNewStaff({
                name: "",
                email: "",
                phone: "",
                password: "",
                location: "",
                role: "STAFF"
            });

            setShowAddForm(false);
            setEditingStaff(null);

            await loadStaff();

        } catch (error) {

            console.error("Save staff error:", error);

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Unable to save staff"
            );

        } finally {

            setSaving(false);
        }
    };

    // Edit staff
    const handleEditStaff = (staff) => {

        setEditingStaff(staff);

        setNewStaff({
            name: staff.name || "",
            email: staff.email || "",
            phone: staff.phone || "",
            password: "",
            location: staff.location || "",
            role: staff.role || "STAFF"
        });

        setShowAddForm(true);
        setError("");
        setSuccessMessage("");
    };

    // Open delete confirmation
    const handleDeleteClick = (staff) => {

        setStaffToDelete(staff);
        setError("");
        setSuccessMessage("");
    };

    // Delete staff
    const handleDeleteStaff = async () => {

        if (!staffToDelete) {
            return;
        }

        try {

            setDeleting(true);
            setError("");
            setSuccessMessage("");

            await api.delete(
                `/api/staff/${staffToDelete.id}`
            );

            setSuccessMessage(
                `${staffToDelete.name} deleted successfully!`
            );

            setStaffToDelete(null);

            await loadStaff();

        } catch (error) {

            console.error("Delete staff error:", error);

            if (error.response?.status === 409) {

                setError(
                    error.response?.data ||
                    "Staff cannot be deleted because they have existing delivery assignments."
                );

                setStaffToDelete(null);
                return;
            }

            if (error.response?.status === 404) {

                setError("Staff member not found.");
                setStaffToDelete(null);
                return;
            }

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Unable to delete staff"
            );

            setStaffToDelete(null);

        } finally {

            setDeleting(false);
        }
    };

    return (
        <div className="staff-management">

            {/* Header */}

            <div className="staff-header">

                <div>
                    <h1>Staff Management</h1>

                    <p>
                        Create and manage courier staff members
                    </p>
                </div>

                <LogoutButton />

            </div>

            {/* Back Button */}

            <button
                className="back-dashboard-button"
                onClick={() => navigate("/admin")}
            >
                ← Back to Dashboard
            </button>

            {/* Messages */}

            {successMessage && (
                <div className="staff-success">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="staff-error">
                    {error}
                </div>
            )}

            {/* Staff Section */}

            <div className="staff-list-container">

                <div className="staff-list-header">

                    <div>
                        <h2>Staff Members</h2>

                        <p>
                            {staffList.length} staff member
                            {staffList.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {/* Add Staff */}

                    <button
                        className="add-staff-button"
                        onClick={() => {

                            setEditingStaff(null);

                            setNewStaff({
                                name: "",
                                email: "",
                                phone: "",
                                password: "",
                                location: "",
                                role: "STAFF"
                            });

                            setShowAddForm(true);
                            setError("");
                            setSuccessMessage("");
                        }}
                    >
                        + Add New Staff
                    </button>

                </div>

                {/* Add / Edit Staff Form */}

                {showAddForm && (

                    <div className="add-staff-form">

                        <div className="add-form-header">

                            <div>

                                <h2>
                                    {editingStaff
                                        ? "Edit Staff"
                                        : "Add New Staff"}
                                </h2>

                                <p>
                                    {editingStaff
                                        ? "Update the staff member details"
                                        : "Enter the staff member details"}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="close-form-button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditingStaff(null);
                                }}
                            >
                                ×
                            </button>

                        </div>

                        <form onSubmit={handleCreateStaff}>

                            <div className="form-grid">

                                {/* Name */}

                                <div className="form-group">

                                    <label>Name</label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={newStaff.name}
                                        onChange={handleChange}
                                        placeholder="Enter staff name"
                                        required
                                    />

                                </div>

                                {/* Email */}

                                <div className="form-group">

                                    <label>Email</label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={newStaff.email}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                        required
                                    />

                                </div>

                                {/* Phone */}

                                <div className="form-group">

                                    <label>Phone</label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={newStaff.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        required
                                    />

                                </div>

                                {/* Password */}

                                <div className="form-group">

                                    <label>Password</label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={newStaff.password}
                                        onChange={handleChange}
                                        placeholder={
                                            editingStaff
                                                ? "Enter new password (optional)"
                                                : "Enter password"
                                        }
                                        required={!editingStaff}
                                    />

                                </div>

                                {/* Location */}

                                <div className="form-group">

                                    <label>Location</label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={newStaff.location}
                                        onChange={handleChange}
                                        placeholder="Example: Chennai"
                                        required
                                    />

                                </div>

                                {/* Role */}

                                <div className="form-group">

                                    <label>Role</label>

                                    <select
                                        name="role"
                                        value={newStaff.role}
                                        onChange={handleChange}
                                    >

                                        <option value="STAFF">
                                            STAFF
                                        </option>

                                        <option value="ADMIN">
                                            ADMIN
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* Form Actions */}

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="cancel-staff-button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingStaff(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-staff-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingStaff
                                            ? "Update Staff"
                                            : "Create Staff"}
                                </button>

                            </div>

                        </form>

                    </div>
                )}

                {/* Loading */}

                {loading && (
                    <div className="staff-loading">
                        Loading staff members...
                    </div>
                )}

                {/* Empty */}

                {!loading &&
                    !error &&
                    staffList.length === 0 && (

                        <div className="staff-empty">
                            No staff members found.
                        </div>
                    )
                }

                {/* Staff Table */}

                {!loading &&
                    !error &&
                    staffList.length > 0 && (

                        <div className="staff-table-wrapper">

                            <table className="staff-table">

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Location</th>
                                        <th>Role</th>
                                        <th>Actions</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {staffList.map((staff) => (

                                        <tr key={staff.id}>

                                            <td>
                                                {staff.id}
                                            </td>

                                            <td>
                                                <strong>
                                                    {staff.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {staff.email}
                                            </td>

                                            <td>
                                                {staff.phone}
                                            </td>

                                            <td>
                                                {staff.location}
                                            </td>

                                            <td>

                                                <span className="staff-role">
                                                    {staff.role}
                                                </span>

                                            </td>

                                            <td>

                                                <div className="staff-actions">

                                                    {/* Edit */}

                                                    <button
                                                        className="edit-staff-button"
                                                        onClick={() =>
                                                            handleEditStaff(staff)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    {/* Delete */}

                                                    <button
                                                        className="delete-staff-button"
                                                        onClick={() =>
                                                            handleDeleteClick(staff)
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

            </div>

            {/* Delete Confirmation Modal */}

            {staffToDelete && (

                <div className="delete-modal-overlay">

                    <div className="delete-modal">

                        <div className="delete-modal-icon">
                            !
                        </div>

                        <h2>
                            Delete Staff?
                        </h2>

                        <p>
                            Are you sure you want to delete
                            <strong> {staffToDelete.name}</strong>?
                        </p>

                        <p className="delete-warning">
                            This action cannot be undone.
                        </p>

                        <div className="delete-modal-actions">

                            <button
                                className="delete-cancel-button"
                                onClick={() => setStaffToDelete(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                className="delete-confirm-button"
                                onClick={handleDeleteStaff}
                                disabled={deleting}
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete Staff"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default StaffManagement;