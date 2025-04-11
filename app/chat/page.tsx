import { ChatEmbed } from "@/components/chat-embed"

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chat with Sergeant Ken</h1>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <ChatEmbed height="600px" />
      </div>
    </div>
  )
}