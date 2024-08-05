export const aiServiceUrl = {
  loadKnowledge: '/load-agent-knowledge-base',
  createAssistantRun: '/create',
  sendMessage: '/chat',
  getAgentHistory: '/history',
};

export const AI_QUEUE_NAME = 'ai-chatbot-queue';

export const AI_QUEUE_JOB = {
  LOAD_KNOWLEDGE: 'LOAD_KNOWLEDGE',
  SEND_MESSAGE: 'SEND_MESSAGE',
  CREATE_RUN: 'CREATE_RUN',
  SEND_MESSAGE_DISCORD: 'SEND_MESSAGE_DISCORD',
};
