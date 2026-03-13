import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ["three"],
            "three-eco": [
              "@react-three/fiber",
              "@react-three/drei",
              "@react-three/postprocessing",
            ],
            rapier: ["@react-three/rapier"],
          },
        },
      },
    },
    plugins: [
      react(),
      {
        name: "api-chat-proxy",
        configureServer(server) {
          server.middlewares.use("/api/chat", (req, res) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: "Method not allowed" }));
              return;
            }
            let body = "";
            req.on("data", (chunk: Buffer) => {
              body += chunk.toString();
            });
            req.on("end", async () => {
              try {
                const { messages, context } = JSON.parse(body);
                const groqKey = env.GROQ_API_KEY;
                const model = env.GROQ_MODEL || "llama-3.3-70b-versatile";

                if (!groqKey) {
                  res.setHeader("Content-Type", "application/json");
                  res.end(
                    JSON.stringify({
                      reply:
                        "GROQ_API_KEY not set in .env — using fallback mode.",
                    })
                  );
                  return;
                }

                const groqRes = await fetch(
                  "https://api.groq.com/openai/v1/chat/completions",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${groqKey}`,
                    },
                    body: JSON.stringify({
                      model,
                      temperature: 0.7,
                      max_tokens: 200,
                      messages: [
                        { role: "system", content: context },
                        ...messages.slice(-6),
                      ],
                    }),
                  }
                );

                if (!groqRes.ok) {
                  const errText = await groqRes.text();
                  console.error("[CHAT] Groq error:", errText);
                  res.setHeader("Content-Type", "application/json");
                  res.end(
                    JSON.stringify({
                      reply:
                        "Groq API returned an error. Check your key and model.",
                    })
                  );
                  return;
                }

                const data: any = await groqRes.json();
                const reply =
                  data.choices?.[0]?.message?.content ||
                  "Sorry, I couldn't process that.";
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ reply }));
              } catch (err) {
                console.error("[CHAT] Error:", err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Internal server error" }));
              }
            });
          });
        },
      },
    ],
  };
});
