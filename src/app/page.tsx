import { ChatWithKawnAI } from "@/components/ChatWithKawnAI";

export default function Home() {
  return (
    <div className="mx-auto flex h-[100dvh] max-h-[100dvh] w-full max-w-xl flex-col bg-[#0b0b0c] lg:max-w-2xl">
      <ChatWithKawnAI />
    </div>
  );
}
