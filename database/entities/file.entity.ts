import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Agent } from './agent.entity';

@Entity()
export class File extends BaseEntity {
  @Column()
  key: string;

  @Column()
  agentId: string;

  @OneToOne(() => Agent, (agent) => agent.id)
  @JoinColumn({ name: 'agent_id' })
  agent: Agent;
}
