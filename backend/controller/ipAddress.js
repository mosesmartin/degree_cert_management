const connection = require('../database/connection'); // Import database connection

const isValidIPv4 = (ip) => {
    // Regular expression to validate IPv4 addresses
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Pattern.test(ip);
};

const extractIPv4 = (ip) => {
    // Check if the IP is an IPv4-mapped IPv6 address
    if (ip.includes("::ffff:")) {
        return ip.split("::ffff:")[1]; // Extract the IPv4 part
    }
    return ip;
};

const ipAddress = (req, res) => {
    // Retrieve client IP address from the request
    const rawIP = req.ip || req.connection.remoteAddress;
    const clientIP = extractIPv4(rawIP); // Extract the actual IPv4 address

    // Check if the IP is a valid IPv4 address
    if (!isValidIPv4(clientIP)) {
        return res.status(400).json({
            ipAddress: clientIP,
            isValid: false,
            message: "Invalid IPv4 address"
        });
    }

    // Query to check if IP is allowed
    const query = 'SELECT ip_address FROM allowed_ips WHERE ip_address = ?';

    connection.query(query, [clientIP], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if the IP is valid
        const isValid = results.length > 0;

        // Log IP address and validation result
        console.log("Client IP Address Retrieved:", clientIP);
        console.log("Is IP Address Valid:", isValid);

        res.status(200).json({
            ipAddress: clientIP,
            isValid: isValid,
            message: isValid ? "Access Granted" : "Access Denied"
        });
    });
};

module.exports = ipAddress;
