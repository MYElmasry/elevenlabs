import { useState, useCallback } from "react";
import { useConversation } from "@11labs/react";
import "./App.css";

function App() {
  const [agentId, setAgentId] = useState(""); // State for the agentId
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Start the conversation with the provided agentId
      await conversation.startSession({ agentId });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <input
          type="text"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          placeholder="Enter Agent ID"
          className="px-4 py-2 border rounded"
        />
        <div className="flex gap-2">
          <button
            onClick={startConversation}
            disabled={!agentId || conversation.status === "connected"}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Start Conversation
          </button>
          <button
            onClick={stopConversation}
            disabled={!agentId || conversation.status !== "connected"}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            Stop Conversation
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
      </div>
    </div>
  );
}

export default App;
