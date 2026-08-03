export const auditLog = (action) => {
  return (req, res, next) => {
    // We capture the original send to intercept the response status
    const originalSend = res.send;
    res.send = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Log to console (in production, log to database 'audit_logs' table)
        console.log(`[AUDIT] Action: ${action} | User: ${req.user?.id || 'anonymous'} | Status: ${res.statusCode} | Timestamp: ${new Date().toISOString()}`);
      }
      originalSend.call(this, data);
    };
    next();
  };
};
