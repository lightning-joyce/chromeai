"use client";

import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef } from "react";

type AIModelAvailability = 'readily' | 'after-download' | 'no';

declare global {
  interface Window {
    ai: AI;
  }

  interface AI {
    languageModel: {
      create(): Promise<AITextSession>;
      capabilities(): Promise<{
        available: AIModelAvailability;
        defaultTemperature?: number;
        defaultTopK?: number;
        maxTemperature?: number;
        maxTopK?: number;
      }>;
    };
  }

  interface AITextSession {
    prompt(input: string): Promise<string>;
    promptStreaming(input: string): AsyncGenerator<string>;
  }
}

const checkAI = async () => {
  if ("ai" in window) {
    const available = (await window.ai.languageModel.capabilities()).available
    if (available === 'readily') {
      return true;
    }
  }
  return false;
};

export default function ChatBox() {
  const rawChatHistory = useRef<any[]>([]);
  const [endMessage, setEndMessage] = useState<null | HTMLDivElement>(null);
  const [session, setSession] = useState<null | AITextSession>(null);
  const [isAI, setIsAI] = useState<null | boolean>(null);
  const [inputValue, setInputValue] = useState("");
  const [inferring, setInferring] = useState(false);
  const [chatHistory, setChatHistory] = useState(rawChatHistory.current);

  const updateIsAI = async () => {
    const checkAIStatus = await checkAI();

    if (checkAIStatus) {
      // Could add `temperature` and `topK` parameters here to the `create` function.
      // defaultTemperature is 1, defaultTopK is 3
      const thisSession = await window.ai.languageModel.create();
      setSession(thisSession);
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
              Built-in AI not work. Please check{" "}
              <a
                href='https://github.com/lightning-joyce/chromeai?tab=readme-ov-file#how-to-set-up-built-in-gemini-nano-in-chrome'
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
            setInferring(true);

            rawChatHistory.current.push({
              id: rawChatHistory.current.length + 1,
              role: "user",
              text: inputValue,
            });
            setChatHistory(rawChatHistory.current);
            setInputValue("");

            const prompt = `${rawChatHistory.current.map((chat) => {
              return `${chat.role}: ${chat.text}\n`;
            })}\nassistant:`;
            let aiReplay = await session!.prompt(prompt);
            console.log(aiReplay, typeof aiReplay);

            if (!aiReplay || aiReplay.length == 0) {
              aiReplay = "[Nothing]";
            }

            rawChatHistory.current.push({
              id: rawChatHistory.current.length + 1,
              role: "assistant",
              text: aiReplay,
            });
            setChatHistory(rawChatHistory.current);

            setInferring(false);
          }}
          onReset={() => {
            rawChatHistory.current = [];
            setChatHistory([]);
            setInputValue("");
          }}
        >
          <Button type='reset' disabled={!isAI || inferring}>
            New Chat
          </Button>
          <Input
            placeholder='Type here'
            name='text'
            value={inputValue}
            onInput={(e) => {
              if ("value" in e.target) {
                setInputValue(e.target.value as string);
              }
            }}
            disabled={!isAI}
          />
          <Button type='submit' disabled={!isAI || inferring}>
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
          <p className='text-center'>
            Open source on{" "}
            <a
              href='https://github.com/lightning-joyce/chromeai'
              target='_blank'
              className='font-medium text-primary underline underline-offset-4'
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
