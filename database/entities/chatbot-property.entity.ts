import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Chatbot } from './chatbot.entity';
import { Knowledge } from './knowledge.entity';
import { Prompt } from './prompt.entity';
import { Persona } from './persona.entity';

@Entity()
export class ChatbotProperty extends BaseEntity {
  @Column({ type: 'uuid', primary: true })
  chatbotId: string;

  @OneToOne(() => Chatbot, (chatbot) => chatbot.id)
  @JoinColumn({ name: 'chatbot_id' })
  chatbot: Chatbot;

  @Column({ type: 'uuid' })
  promptId: string;

  @OneToOne(() => Prompt, (prompt) => prompt.id)
  @JoinColumn({ name: 'prompt_id' })
  prompt: Prompt;

  @Column({ type: 'uuid' })
  personaId: string;

  @OneToOne(() => Persona, (persona) => persona.id)
  @JoinColumn({ name: 'persona_id' })
  Persona: Persona;

  @Column({ type: 'uuid' })
  knowledgeId: string;

  @OneToOne(() => Knowledge, (knowledge) => knowledge.id)
  @JoinColumn({ name: 'knowledge_id' })
  knowledge: Knowledge;
}
