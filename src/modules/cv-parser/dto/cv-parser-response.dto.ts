import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Gender, LanguageLevel } from 'src/common/enums';

@Exclude()
export class CvWorkExperience {
  @ApiProperty({ example: 'Codelight', nullable: true })
  @Expose()
  companyName: string | null;

  @ApiProperty({ example: 'Software Engineer', nullable: true })
  @Expose()
  position: string | null;

  @ApiProperty({ example: 1, nullable: true })
  @Expose()
  fromMonth: number | null;

  @ApiProperty({ example: 2020, nullable: true })
  @Expose()
  fromYear: number | null;

  @ApiProperty({ example: 5, nullable: true })
  @Expose()
  toMonth: number | null;

  @ApiProperty({ example: 2021, nullable: true })
  @Expose()
  toYear: number | null;

  @ApiProperty({ example: 'I am a software engineer', nullable: true })
  @Expose()
  description: string | null;
}

export class CvLanguage {
  @ApiProperty({ example: 'english', nullable: true })
  label: string;

  @ApiProperty({
    enum: LanguageLevel,
    example: LanguageLevel.CONVERSATIONAL,
  })
  level: LanguageLevel | null;
}

@Exclude()
export class CvEducation {
  @ApiProperty({
    example: 'University of Information Technology',
    nullable: true,
  })
  @Expose()
  institution: string | null;

  @ApiProperty({
    example: 'Bachelor of Computer Science (MSCS)',
    nullable: true,
  })
  @Expose()
  degree: string | null;

  @ApiProperty({ example: 1, nullable: true })
  @Expose()
  fromMonth: number | null;

  @ApiProperty({ example: 12, nullable: true })
  @Expose()
  toMonth: number | null;

  @ApiProperty({ example: 2020, nullable: true })
  @Expose()
  fromYear: number | null;

  @ApiProperty({ example: 2021, nullable: true })
  @Expose()
  toYear: number | null;
}

@Exclude()
export class ParseCvResponseDto {
  @ApiProperty({ example: 'Lau' })
  @Expose()
  firstName: string | null;

  @ApiProperty({ example: 'Truong' })
  @Expose()
  lastName: string | null;

  @ApiProperty({ enum: Gender, example: Gender.OTHERS })
  @Expose()
  gender: Gender | null;

  @ApiProperty({ example: new Date() })
  @Expose()
  dateOfBirth: Date;

  @ApiProperty({ example: 'lau@codelight.co' })
  @Expose()
  email: string | null;

  @ApiProperty({ example: '+84' })
  @Expose()
  phoneCode: string | null;

  @ApiProperty({ example: '934224745' })
  @Expose()
  phone: string | null;

  @ApiProperty({ example: 'Software Engineer' })
  @Expose()
  title: string | null;

  @ApiProperty({ example: 'I am a software engineer' })
  @Expose()
  summary: string | null;

  @ApiProperty({ example: 1 })
  @Expose()
  totalYearOfExperience: number | null;

  @ApiProperty({ example: 'Ho Chi Minh' })
  @Expose()
  location: string | null;

  @ApiProperty({ type: [CvWorkExperience] })
  @Expose()
  @Type(() => CvWorkExperience)
  workExperiences: CvWorkExperience[];

  @ApiProperty({ type: [CvEducation] })
  @Expose()
  @Type(() => CvEducation)
  educations: CvEducation[];

  @ApiProperty({ example: ['NodeJs', 'SQL'] })
  @Expose()
  skills: string[];

  @ApiProperty({ type: [CvLanguage] })
  @Expose()
  @Type(() => CvLanguage)
  languages: CvLanguage[];
}
