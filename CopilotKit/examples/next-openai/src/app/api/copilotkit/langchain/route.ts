import { CopilotRuntime, LangChainAdapter } from "@copilotkit/runtime";

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const copilotKit = new CopilotRuntime({
    actions: [
      {
        name: "sayHello",
        description: "Says hello to someone.",
        parameters: [
          {
            name: "arg",
            type: "string",
            description: "The name of the person to say hello to.",
            required: true,
          },
        ],
        handler: async ({ arg }) => {
          console.log("Hello from the server", arg, "!");
        },
      },
    ],
  });

  return copilotKit.response(
    req,
    new LangChainAdapter({
      chainFn: async (forwardedProps) => {
        const model = new ChatOpenAI({ modelName: "gpt-4-1106-preview" });
        // TODO-PROTOCOL: fix compile error
        // @ts-ignore
        return model.stream(forwardedProps.messages, { tools: forwardedProps.tools });
      },
    }),
  );
}
