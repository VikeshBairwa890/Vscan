interface ChatMessageProps {
  message: string;
  sender: "bot" | "user";
}

export default function ChatMessage({
  message,
  sender,
}: ChatMessageProps) {
  const isBot = sender === "bot";

  return (
    <div
      className={`flex w-full ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm md:text-base ${
          isBot
            ? "bg-zinc-800 text-white"
            : "bg-white text-black"
        }`}
      >
        {message}
      </div>
    </div>
  );
}