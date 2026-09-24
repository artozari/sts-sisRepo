"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYNC_CONFIG = void 0;
exports.isSyncRequestAllowed = isSyncRequestAllowed;
exports.markSyncRequested = markSyncRequested;
exports.markSyncResolved = markSyncResolved;
exports.hasPendingSync = hasPendingSync;
exports.shouldAlertPendingSync = shouldAlertPendingSync;
exports.getPendingSyncInfo = getPendingSyncInfo;
const SYNC_REQUEST_COOLDOWN_MS = 30000;
const SYNC_PENDING_TIMEOUT_MS = 120000;
const SYNC_ALERT_INTERVAL_MS = 60000;
const pendingByTable = new Map();
function isSyncRequestAllowed(fk_table, now) {
    const pending = pendingByTable.get(fk_table);
    if (!pending)
        return true;
    return now - pending.lastRequestAt >= SYNC_REQUEST_COOLDOWN_MS;
}
function markSyncRequested(fk_table, now) {
    const existing = pendingByTable.get(fk_table);
    pendingByTable.set(fk_table, {
        lastRequestAt: now,
        pendingSince: existing?.pendingSince ?? now,
        lastAlertAt: existing?.lastAlertAt ?? 0,
    });
}
function markSyncResolved(fk_table) {
    pendingByTable.delete(fk_table);
}
function hasPendingSync(fk_table) {
    return pendingByTable.has(fk_table);
}
function shouldAlertPendingSync(fk_table, now) {
    const pending = pendingByTable.get(fk_table);
    if (!pending)
        return false;
    if (now - pending.pendingSince < SYNC_PENDING_TIMEOUT_MS)
        return false;
    if (now - pending.lastAlertAt < SYNC_ALERT_INTERVAL_MS)
        return false;
    pending.lastAlertAt = now;
    return true;
}
function getPendingSyncInfo(fk_table, now) {
    const pending = pendingByTable.get(fk_table);
    if (!pending)
        return null;
    return { timePendingMs: now - pending.pendingSince };
}
exports.SYNC_CONFIG = {
    cooldownMs: SYNC_REQUEST_COOLDOWN_MS,
    pendingTimeoutMs: SYNC_PENDING_TIMEOUT_MS,
    alertIntervalMs: SYNC_ALERT_INTERVAL_MS,
};
