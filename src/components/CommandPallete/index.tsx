import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

interface Command {
  name: string;
  icon: string;
  action: { type: string; payload: any };
}

interface CommandList {
  type: string;
  commands: Command[];
}

const commandList: CommandList[] = [
  {
    type: "Navigate",
    commands: [
      {
        name: "Dashboard",
        icon: "solar:home-angle-line-duotone",
        action: { type: "navigate", payload: "/cms" },
      },
      {
        name: "Courses",
        icon: "solar:book-line-duotone",
        action: { type: "navigate", payload: "/cms/courses" },
      },
    ],
  },
  {
    type: "Courses",
    commands: [
      {
        name: "Create Course",
        icon: "solar:book-line-duotone",
        action: { type: "create", payload: "" },
      },
    ],
  },
  {
    type: "Sections",
    commands: [
      {
        name: "Create Section",
        icon: "solar:widget-line-duotone",
        action: { type: "create", payload: "" },
      },
    ],
  },
  {
    type: "Tasks",
    commands: [
      {
        name: "Create Task",
        icon: "solar:programming-line-duotone",
        action: { type: "create", payload: "" },
      },
    ],
  },
  {
    type: "Users",
    commands: [
      {
        name: "Add Administrator",
        icon: "solar:shield-user-line-duotone",
        action: { type: "create", payload: "" },
      },
      {
        name: "Add Teacher",
        icon: "solar:case-round-minimalistic-linear",
        action: { type: "create", payload: "" },
      },
      {
        name: "Add Student",
        icon: "solar:user-hand-up-line-duotone",
        action: { type: "create", payload: "" },
      },
      {
        name: "Add Non-KU Student",
        icon: "solar:user-line-duotone",
        action: { type: "create", payload: "" },
      },
    ],
  },
  {
    type: "Logger",
    commands: [
      {
        name: "View Logs",
        icon: "solar:graph-line-duotone",
        action: { type: "create", payload: "" },
      },
    ],
  },
];

function CommandPallete() {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const getAllCommands = commandList.map((data) => data.commands).flat();

  const filteredCommands = getAllCommands.filter((command) =>
    command.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredCommands.length) % filteredCommands.length
        );
        break;
      case "Enter":
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
        break;
    }
  };

  const executeCommand = (command: Command) => {
    if (command.action.type === "navigate") {
      router.push(command.action.payload);
    }
  };

  return (
    <div className="fixed z-50 w-full h-screen bg-opacity-20 bg-sand-12">
      <div className="shadow absolute top-[20%] max-h-[30rem] overflow-auto left-1/2 -translate-x-1/2 w-[40rem] rounded-lg bg-white px-4">
        <div className="flex items-center gap-2">
          <Icon icon="solar:magnifer-line-duotone" className="text-xl" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full p-2 text-lg border-b outline-none"
            placeholder="Enter a command"
          />
        </div>
        <div className="flex items-center justify-end gap-2 my-4">
          <div className="px-3 py-1 text-xs border-b-2 rounded-lg bg-sand-4 border-sand-10">
            <Icon icon="mi:enter" className="text-sm" />
          </div>
          <p className="text-xs">to Select</p>

          <div className="px-3 py-1 text-xs border-b-2 rounded-lg bg-sand-4 border-sand-10">
            <code className="text-xs">esc</code>
          </div>
          <p className="text-xs">to Close</p>
        </div>
        <div className="my-4">
          {commandList.map(({ type, commands }, outerIndex) => {
            const filteredCommands = commands.filter(({ name }) =>
              name.toLowerCase().includes(search.toLowerCase())
            );
            const isNoCommand = filteredCommands.length === 0;
            if (isNoCommand) return null;
            return (
              <div key={type}>
                <h4 className="mb-2 text-sm text-sand-10">{type}</h4>
                {filteredCommands.map((command, innerIndex) => {
                  let commandIndex = innerIndex;
                  if (outerIndex !== 0) {
                    let i = 1;
                    commandIndex =
                      commandList.reduce((prev, curr) => {
                        if (i > outerIndex) return prev;
                        i++;
                        return prev + curr.commands.length;
                      }, 0) + innerIndex;
                  }

                  return (
                    <button
                      onClick={() => executeCommand(command)}
                      key={command.name}
                      className={clsx(
                        "flex items-center w-full gap-2 p-2 rounded-lg hover:bg-sand-2",
                        commandIndex === selectedIndex && "bg-sand-2"
                      )}
                    >
                      <Icon icon={command.icon} className="text-xl" />
                      <h4 className="text-lg text-sand-12">{command.name}</h4>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CommandPallete;
