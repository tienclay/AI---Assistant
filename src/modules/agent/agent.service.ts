import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from 'database/entities/agent.entity';
import { Repository } from 'typeorm';
import { CompanyAgentDto } from './dto';
import { Tone } from 'src/common/enums/prompt.enum';
import { PromptDto } from './dto/prompt-data.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  generatePrompt(formData: PromptDto): string {
    const {
      client_name,
      contact_email,
      phone_number,
      company_name,
      website,
      objectives,
      industry,
      description,
      languages,
      tone,
      features,
      integration,
      specific_questions,
      interaction_scenarios,
      other_requirements,
      additional_notes,
    } = formData;

    // Introduction to the virtual assistant for the company
    let prompt = `### Welcome to ${company_name} Virtual Assistant\n\n`;
    prompt += `Hello, I'm your virtual assistant for ${company_name}. My role is to assist you with information and support regarding our company's services, products, and mission. Let's get started with an overview:\n\n`;

    // Client Information
    prompt += `**Client Information:**\n`;
    prompt += `- **Client Name:** ${client_name}\n`;
    prompt += `- **Contact Email:** ${contact_email}\n`;
    prompt += `- **Phone Number:** ${phone_number}\n\n`;

    // Company Details
    prompt += `**Company Details:**\n`;
    prompt += `- **Company Name:** ${company_name}\n`;
    prompt += `- **Website:** [${website}](${website})\n`;
    prompt += `- **Industry Focus:** ${industry}\n`;
    prompt += `- **Company Description:** ${description}\n\n`;

    // Primary Objectives
    prompt += `**Primary Objectives:**\n`;
    objectives.forEach((obj) => {
      prompt += `- ${obj}\n`;
    });
    prompt += `\n`;

    // Languages and Tone
    prompt += `**Languages and Tone:**\n`;
    prompt += `- We communicate in ${languages.join(', ')} with a ${tone.toLowerCase()} tone, reflecting our commitment to ${tone === Tone.Professional ? 'professionalism' : 'approachability and friendliness'}.\n\n`;

    // Key Features
    prompt += `**Key Features:**\n`;
    features.forEach((feature) => {
      prompt += `- ${feature}\n`;
    });
    prompt += `\n`;

    // Integration
    prompt += `**Integration:**\n`;
    integration.forEach((integrate) => {
      prompt += `- ${integrate}\n`;
    });
    prompt += `\n`;

    // Interaction Scenarios
    prompt += `**Interaction Scenarios:**\n`;
    interaction_scenarios.forEach((scenario) => {
      prompt += `- ${scenario}\n`;
    });
    prompt += `\n`;

    // Specific Questions Addressed
    prompt += `**Specific Questions Addressed:**\n`;
    specific_questions.forEach((question) => {
      prompt += `- ${question}\n`;
    });
    prompt += `\n`;

    // Other Requirements
    prompt += `**Other Requirements:**\n`;
    other_requirements.forEach((req) => {
      prompt += `- ${req}\n`;
    });
    prompt += `\n`;

    // Additional Notes
    prompt += `**Additional Notes:**\n`;
    prompt += `${additional_notes}\n\n`;
    prompt += `**Security Requirements:**\n`;

    prompt += `Ensure the security of customer information in all interactions and data collection processes.\n`;

    // Example Interactions
    prompt += `### Example Interactions:\n\n`;
    prompt += `1. **Mission Inquiry:**\n`;
    prompt += `   - User: "What is ${company_name}'s mission?"\n`;
    prompt += `   - Assistant: "${description}"\n\n`;

    prompt += `2. **Product Inquiry:**\n`;
    prompt += `   - User: "How can I [use/benefit from/purchase] ${company_name}'s products/services?"\n`;
    prompt += `   - Assistant: "To [use/benefit from/purchase] our products/services, [briefly describe the process or highlight key features]."\n\n`;

    prompt += `3. **Technical Support Request:**\n`;
    prompt += `   - User: "I'm experiencing issues with [specific product/service]. Can you help?"\n`;
    prompt += `   - Assistant: "I can assist you with troubleshooting steps for [specific issue], or connect you with our technical support team for further assistance."\n\n`;

    return prompt;
  }

  async createAgent(createCompanyDto: CompanyAgentDto): Promise<Agent> {
    const agent = this.agentRepository.create(createCompanyDto);
    return await this.agentRepository.save(agent);
  }

  async getAgentByClientId(clientId: string): Promise<Agent[]> {
    return this.agentRepository.find({ where: { userId: clientId } });
  }

  async uploadPrompt(id: string, inputData: PromptDto): Promise<PromptDto> {
    try {
      // const prompt = this.generatePrompt(inputData);
      const agent = await this.agentRepository.findOneByOrFail({ id });
      agent.prompt = JSON.stringify(inputData);
      await this.agentRepository.save(agent);
      return inputData;
    } catch (err) {
      throw new NotFoundException('Not found agent');
    }
  }

  async getAllAgents(): Promise<CompanyAgentDto[]> {
    const agents = await this.agentRepository.find();
    return agents.map((agent) => plainToInstance(CompanyAgentDto, agent)); //
  }

  async getAgentById(id: string): Promise<CompanyAgentDto> {
    try {
      const agent = await this.agentRepository.findOneByOrFail({ id });
      return plainToInstance(CompanyAgentDto, agent);
    } catch (err) {
      throw new NotFoundException('Not found agent');
    }
  }
}
