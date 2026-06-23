exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const promptText = body.prompt;

        if (!promptText) {
            return { statusCode: 400, body: JSON.stringify({ error: "No prompt provided" }) };
        }

        const keys = [
            { name: "GEM_1", key: process.env.GEM_1 },
            { name: "GEM_2", key: process.env.GEM_2 },
            { name: "GEM_3", key: process.env.GEM_3 }
        ];

        let lastError = null;
        let successfulData = null;
        let usedKeyName = "";

        for (let i = 0; i < keys.length; i++) {
            const currentObj = keys[i];
            if (!currentObj.key) continue;

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${currentObj.key}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }],
                        generationConfig: {
                            temperature: 0.7,
                            responseMimeType: "application/json"
                        }
                    })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    lastError = { status: response.status, details: errText };
                    console.warn(`[Failover] Failed using ${currentObj.name}: ${response.status}`);
                    continue; // Intentar con la siguiente
                }

                successfulData = await response.json();
                usedKeyName = currentObj.name;
                break; // Éxito, salir del ciclo
            } catch (error) {
                console.warn(`[Failover] Connection error using ${currentObj.name}: ${error.message}`);
                lastError = { error: error.message };
                continue; // Intentar con la siguiente
            }
        }

        if (successfulData) {
            // Adjuntamos qué key se usó exitosamente para que el cliente lo muestre
            successfulData.usedKey = usedKeyName;
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(successfulData)
            };
        } else {
            return {
                statusCode: 503,
                body: JSON.stringify({ error: "All Gemini API keys failed", lastError })
            };
        }
    } catch (error) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message })
        };
    }
};
