// there are three types of command, slash command, user command and message command

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

const RAG_COMMAND = {
  name: 'rag-ai',
  description: "Answers any questions based on the bot's knowledge",
  type: 1,
};

export const ALL_COMMANDS = [TEST_COMMAND, RAG_COMMAND];
