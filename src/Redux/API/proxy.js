export default async function handler(req, res) {
    if (req.method === "OPTIONS") {
        // Handle CORS preflight request
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return res.status(204).end();
    }

    const backendURL = `http://192.168.1.40:8000${req.url.replace('/api', '')}`;

    try {
        const response = await fetch(backendURL, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                ...req.headers, // Forward all headers
            },
            body: req.method === "GET" || req.method === "HEAD" ? null : JSON.stringify(req.body),
        });

        const contentType = response.headers.get("content-type");

        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text(); // Handle non-JSON responses
        }

        // Set CORS headers to allow frontend access
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).json({ error: "Backend not reachable" });
    }
}
