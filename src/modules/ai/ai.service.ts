import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AIService {
  constructor(private httpService: HttpService) {}

  /**
   * @description Create a new table in Ai Service
   * @param {string} tableName - The table name based on company name
   * @return {Promise<Boolean>} A promise that resolves to the parsed response.
   * @throws {InternalServerError} If there is an error during the parsing process.
   */

  async createTable(tableName: string): Promise<boolean> {
    try {
      const response = await this.httpService
        .post('/table', { tableName })
        .toPromise();
      return response.data;
    } catch (error) {
      throw new Error('Error creating table');
    }
  }
}
