"use client"

import { useState, useRef, useEffect } from "react"

const INITIAL_MESSAGES = [
  {
    role: "ai" as const,
    text: "I've analyzed your latest Experian report. Your score is 742 — up 12 points from last month. I've identified 3 high-impact opportunities to improve your credit further.",
  },
  {
    role: "user" as const,
    text: "What's the fastest way to improve my score?",
  },
  {
    role: "ai" as const,
    text: "Based on your profile, the highest-impact action is disputing the late payment on your Capital One account from March 2024. Your payment records show this was a bank processing error — you have a strong case. A successful dispute could add 25-40 points. Would you like me to generate the dispute letter?",
  },
]

const SUGGESTED_QUESTIONS = [
  "How can I lower my utilization?",
  "Should I close my oldest card?",
  "Generate a dispute letter",
]

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }, [messages])

  const handleSend = (text?: string) => {
    const msgText = text || input
    if (!msgText.trim()) return

    setMessages((prev) => [
      ...prev,
      { role: "user" as const, text: msgText },
    ])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai" as const,
          text: "I'm analyzing your credit profile to provide the best recommendation. Based on your current data, I'd suggest focusing on reducing your Chase Sapphire utilization from 34% to below 30% — this alone could boost your score by 8-15 points within one billing cycle.",
        },
      ])
    }, 1200)
  }

  return (
    <div style={{ display: "flex", gap: 0, height: "calc(100vh - 56px - 48px)" }}>
      {/* Left: Conversation thread */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: 24,
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.role === "ai" ? (
                <div style={{ maxWidth: "80%" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "var(--text-tertiary)",
                      marginBottom: 8,
                    }}
                  >
                    CREDITAI
                  </div>
                  <div
                    style={{
                      borderLeft: "1px solid var(--accent)",
                      paddingLeft: 16,
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "var(--text-primary)",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    maxWidth: "70%",
                    background: "var(--bg-raised)",
                    padding: "12px 16px",
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "var(--text-primary)",
                  }}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 8,
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your credit..."
            style={{
              flex: 1,
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 0,
              padding: "10px 14px",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--text-primary)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--border-lit)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)"
            }}
          />
          <button
            className="btn-primary"
            onClick={() => handleSend()}
            style={{ padding: "10px 20px" }}
          >
            SEND
          </button>
        </div>
      </div>

      {/* Right: Context panel */}
      <div
        style={{
          width: 320,
          padding: "24px",
          background: "var(--bg-surface)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Score summary */}
        <div>
          <div className="t-card-label" style={{ marginBottom: 12 }}>
            CURRENT SCORE
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 48,
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            742
          </div>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--success)",
            }}
          >
            +12 this month
          </span>
        </div>

        {/* Suggested questions */}
        <div>
          <div className="t-card-label" style={{ marginBottom: 12 }}>
            SUGGESTED QUESTIONS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 0,
                  padding: "8px 12px",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.12s ease, color 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-lit)"
                  e.currentTarget.style.color = "var(--text-primary)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)"
                  e.currentTarget.style.color = "var(--text-secondary)"
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Data source */}
        <div
          style={{
            marginTop: "auto",
            padding: "12px",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="t-card-label" style={{ marginBottom: 4 }}>
            DATA SOURCE
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--text-tertiary)",
              lineHeight: 1.5,
            }}
          >
            Based on your Experian report, last updated May 1, 2026
          </p>
        </div>
      </div>
    </div>
  )
}
