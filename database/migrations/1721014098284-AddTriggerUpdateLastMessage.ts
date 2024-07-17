import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTriggerUpdateLastMessage1721014098284
  implements MigrationInterface
{
  name = 'AddTriggerUpdateLastMessage1721014098284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE OR REPLACE FUNCTION update_last_message()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE conversations 
        SET last_message_id = NEW.id
        WHERE id = NEW.conversation_id;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE OR REPLACE TRIGGER after_message_insert
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_last_message();
    
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS after_message_insert ON messages;
      DROP FUNCTION IF EXISTS update_last_message;
    `);
  }
}
