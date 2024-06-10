"use client";

import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef } from "react";

const checkAI = async () => {
  if (window.ai) {
    if ((await window.ai.canCreateTextSession()) === "readily") {
      return true;
    }
  }
  return false;
};

export default function ChatBox() {
  const rawChatHistory = useRef<any[]>([]);
  const [endMessage, setEndMessage] = useState<null | HTMLDivElement>(null);
  const [model, setModel] = useState({
    prompt: async (inputValue?: string) => {},
  });
  const [isAI, setIsAI] = useState<null | boolean>(null);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState(rawChatHistory.current);

  const updateIsAI = async () => {
    const checkAIStatus = await checkAI();

    if (checkAIStatus) {
      const thisModel = await window.ai.createTextSession();
      setModel(thisModel);
    }

    setIsAI(checkAIStatus);
  };

  useEffect(() => {
    updateIsAI();
  }, []);

  useEffect(() => {
    endMessage?.scrollIntoView({ behavior: "smooth" });
  }, [endMessage]);

  return (
    <>
      <div>
        {isAI === null && <p>Checking your browser</p>}
        {isAI !== null &&
          (isAI ? (
            <p className='text-sm font-medium leading-none'>
              Your chrome support Built-in AI. All code runs locally on your
              computer. No internet.
            </p>
          ) : (
            <p>
              Built-in AI not work. Follow{" "}
              <a
                href='https://x.com/lightning_joyce/status/1800138565411799099'
                className='font-medium text-primary underline underline-offset-4'
              >
                this steps
              </a>{" "}
              to turn on Built-in AI.
            </p>
          ))}
      </div>

      <div className='w-full'>
        <div id='chatbox' className='p-4 h-[40vh] overflow-y-auto'>
          {chatHistory.map((chat) => {
            if (chat.role === "user") {
              return (
                <div className='mb-2 text-right' key={chat.id}>
                  <p className='bg-blue-500 text-white rounded-lg py-2 px-4 inline-block'>
                    {chat.text}
                  </p>
                </div>
              );
            } else {
              return (
                <div
                  className='mb-2'
                  key={chat.id}
                  ref={(el) => {
                    setEndMessage(el);
                  }}
                >
                  <p className='bg-gray-200 text-gray-700 rounded-lg py-2 px-4 inline-block'>
                    {chat.text}
                  </p>
                </div>
              );
            }
          })}
        </div>
        <form
          className='flex w-full items-center space-x-2'
          onSubmit={async (form) => {
            form.preventDefault();
            if (inputValue === "") {
              return;
            }
            rawChatHistory.current.push({
              id: rawChatHistory.current.length + 1,
              role: "user",
              text: inputValue,
            });
            setChatHistory(rawChatHistory.current);

            const prompt = `${rawChatHistory.current.map((chat) => {
              return `${chat.role}: ${chat.text}\n`;
            })}\nassistant:`;
            const aiReplay = await model.prompt(prompt);

            rawChatHistory.current.push({
              id: rawChatHistory.current.length + 1,
              role: "assistant",
              text: aiReplay,
            });
            setChatHistory(rawChatHistory.current);
            setInputValue("");
          }}
          onReset={() => {
            rawChatHistory.current = [];
            setChatHistory([]);
            setInputValue("");
          }}
        >
          <Button type='reset' disabled={!isAI}>
            New Chat
          </Button>
          <Input
            placeholder='Type here'
            name='text'
            value={inputValue}
            onInput={(e) => {
              setInputValue(e.target.value);
            }}
            disabled={!isAI}
          />
          <Button type='submit' disabled={!isAI}>
            Send
          </Button>
        </form>

        <div className='mt-10'>
          <p className='text-center'>
            Made by{" "}
            <a
              href='https://twitter.com/lightning_joyce'
              target='_blank'
              className='font-medium text-primary underline underline-offset-4'
            >
              Lightning Joyce
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
