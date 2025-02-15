"use client";

import { useState } from "react";

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
        });
        const data = await res.json();
        setMessages([...messages, { input, response: data }]);
        setInput("");
    };

    return (
        <div className="flex flex-col p-5">
            <div className="border p-3">
                {messages.map((msg, i) => (
                    <div key={i} className="p-2 border-b">
                        <p><strong>You:</strong> {msg.input}</p>
                        <p><strong>Bot:</strong> {JSON.stringify(msg.response)}</p>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your command..."
                className="border p-2 mt-2"
            />
            <button onClick={handleSend} className="bg-blue-500 text-white p-2 mt-2">
                Send
            </button>
        </div>
    );
}
