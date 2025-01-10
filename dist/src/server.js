import express from 'express';
import { pool, connectToDb } from './connection.js';
await connectToDb();
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Select All Employees
app.get('/api/employee', (req, res) => {
    const sql = `SELECT id, first_name, last_name FROM employee`;
    pool.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: results.rows
        });
    });
});
// Delete an employee
app.delete('/api/employee/:id', (req, res) => {
    const sql = `DELETE FROM employee WHERE id = $1`;
    const params = [req.params.id];
    pool.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        }
        else if (!result.rowCount) {
            res.json({
                message: 'Employee not found'
            });
        }
        else {
            res.json({
                message: 'deleted',
                changes: result.rowCount,
                id: req.params.id
            });
        }
    });
});
// Read list of all employees and roles using LEFT JOIN
app.get('/api/employee-role', (req, res) => {
    const sql = `
        SELECT 
            e.id,
            e.first_name,
            e.last_name,
            r.title AS role
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        ORDER BY e.last_name, e.first_name;
    `;
    pool.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: result.rows
        });
    });
});
// Update employee role
app.put('/api/employee/:id', (req, res) => {
    const sql = `UPDATE employee SET role_id = $1 WHERE id = $2`;
    const params = [req.body.role_id, req.params.id];
    pool.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        }
        else if (!result.rowCount) {
            res.json({
                message: 'Employee not found'
            });
        }
        else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.rowCount
            });
        }
    });
});
// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
