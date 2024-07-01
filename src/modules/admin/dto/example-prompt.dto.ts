import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  Features,
  Integration,
  Languages,
  PrimaryObjective,
  Tone,
} from 'src/common/enums/prompt.enum';

export class PromptDto {
  @IsString()
  @ApiProperty({ example: 'tien' })
  client_name: string;

  @IsString()
  @ApiProperty({ example: 'tien@codelight.co' })
  contact_email: string;

  @IsString()
  @ApiProperty({ example: 'Codelight' })
  company_name: string;

  @IsString()
  @ApiProperty({ example: '12345678' })
  phone_number: string;

  @IsString()
  @ApiProperty({ example: 'https://codelight.co' })
  website: string;

  @IsString()
  @ApiProperty({
    example: [
      PrimaryObjective.CustomerSupport,
      PrimaryObjective.ProductInquiries,
      PrimaryObjective.TechnicalSupport,
      PrimaryObjective.SalesSupport,
      PrimaryObjective.Other,
    ],
  })
  objectives: PrimaryObjective[];

  @IsString()
  @ApiProperty({
    example: 'Tech-based startup lab, Web2 and Web3 technologies',
  })
  industry: string;

  @IsString()
  @ApiProperty({
    example:
      'Exceptional solutions and products for Web2 and Web3 evolution and innovation',
  })
  description: string;

  @IsString()
  @ApiProperty({
    example: [
      Languages.English,
      Languages.Vietnamese,
      Languages.Spanish,
      Languages.French,
      Languages.Chinese,
      Languages.Other,
    ],
  })
  languages: Languages[];

  @IsString()
  @ApiProperty({
    example: [
      Tone.Professional,
      Tone.Friendly,
      Tone.Humorous,
      Tone.Serious,
      Tone.Casual,
      Tone.Other,
    ],
  })
  tone: Tone;

  @IsString()
  @ApiProperty({
    example: [
      Features.FAQ,
      Features.FindProducts,
      Features.ScheduleAppointments,
      Features.CollectInformation,
      Features.ProvideTechnicalSupport,
      Features.ProcessOrders,
      Features.TrackShipments,
      Features.Other,
    ],
  })
  features: Features[];

  @IsString()
  @ApiProperty({
    example: [
      Integration.CRM,
      Integration.OrderManagementSystem,
      Integration.CompanyWebsite,
      Integration.SocialMedia,
      Integration.EmailMarketingSystem,
      Integration.PaymentGateway,
      Integration.CustomerSupportSystem,
      Integration.AnalyticsTool,
      Integration.Other,
    ],
  })
  integration: Integration[];

  @IsString()
  @ApiProperty({
    example: [
      'How to order cleaning products?',
      'How to contact customer support?',
    ],
  })
  specific_questions: string[];

  @IsString()
  @ApiProperty({
    example: ['Product usage guide', 'Service complaint handling process'],
  })
  interaction_scenarios: string[];

  @IsString()
  @ApiProperty({
    example: [
      'Simple and user-friendly interface',
      'Instant notifications when customer feedback is received',
    ],
  })
  other_requirements: string[];

  @IsString()
  @ApiProperty({ example: 'Focus on sustainability and eco-friendliness' })
  additional_notes: string;
}
