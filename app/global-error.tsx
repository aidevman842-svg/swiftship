"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
            background: "#f9fafb",
            padding: "1rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <p style={{ fontSize: 64, margin: 0 }}>⚠️</p>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 16 }}>
              Critical error
            </h1>
            <p style={{ color: "#6b7280", marginTop: 8, fontSize: 14 }}>
              A critical error occurred. Please refresh the page or contact
              support if the problem persists.
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: 24,
                padding: "10px 24px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
