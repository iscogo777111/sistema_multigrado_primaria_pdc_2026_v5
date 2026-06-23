export default async (request, context) => {
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await request.json();
        const promptText = body.prompt;

        if (!promptText) {
            return new Response(JSON.stringify({ error: "No prompt provided" }), {
                status: 400, headers: { "Content-Type": "application/json" }
            });
        }

        const keys = [
            { name: "GEM_1", key: Deno.env.get("GEM_1") },
            { name: "GEM_2", key: Deno.env.get("GEM_2") },
            { name: "GEM_3", key: Deno.env.get("GEM_3") }
        ];

        let lastError = null;
        let successfulData = null;
        let usedKeyName = "";

        for (let i = 0; i < keys.length; i++) {
            const currentObj = keys[i];
            if (!currentObj.key) continue;

            try {
                // Request against Gemini API
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
                    console.warn(`[Failover] Failed using ${currentObj.name}: ${response.status} - ${errText}`);
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
            successfulData.usedKey = usedKeyName;
            return new Response(JSON.stringify(successfulData), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            return new Response(JSON.stringify({ error: "All Gemini API keys failed", lastError }), {
                status: 503,
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (error) {
        console.error("Function error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config = { path: "/.netlify/functions/generate-pdc" };
