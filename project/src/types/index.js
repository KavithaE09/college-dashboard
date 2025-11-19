/**
 * @typedef {Object} StudentRecord
 * @property {string} [_id]
 * @property {string} name
 * @property {string} department
 * @property {string} subject
 * @property {number} mark
 * @property {Date} [createdAt]
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalSubjects
 * @property {number} averageMarks
 * @property {number} completedSubjects
 * @property {number} pendingSubjects
 */

/**
 * @typedef {Object} AuthContextType
 * @property {any} user
 * @property {boolean} isAuthenticated
 * @property {(user: any) => void} login
 * @property {() => void} logout
 */
