import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUserEntity1720599993778 implements MigrationInterface {
    name = 'ModifyUserEntity1720599993778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."users_phone_code_enum" AS ENUM('+84', '+1', '+93', '+358-18', '+355', '+213', '+1-684', '+376', '+244', '+1-264', '+672', '+1-268', '+54', '+374', '+297', '+61', '+43', '+994', '+973', '+880', '+1-246', '+375', '+32', '+501', '+229', '+1-441', '+975', '+591', '+599', '+387', '+267', '+0055', '+55', '+246', '+673', '+359', '+226', '+257', '+855', '+237', '+238', '+1-345', '+236', '+235', '+56', '+86', '+57', '+269', '+242', '+682', '+506', '+225', '+385', '+53', '+357', '+420', '+243', '+45', '+253', '+1-767', '+1-809', '+593', '+20', '+503', '+240', '+291', '+372', '+268', '+251', '+500', '+298', '+679', '+358', '+33', '+594', '+689', '+262', '+241', '+220', '+995', '+49', '+233', '+350', '+30', '+299', '+1-473', '+590', '+1-671', '+502', '+44-1481', '+224', '+245', '+592', '+509', '+504', '+852', '+36', '+354', '+91', '+62', '+98', '+964', '+353', '+972', '+39', '+1-876', '+81', '+44-1534', '+962', '+7', '+254', '+686', '+383', '+965', '+996', '+856', '+371', '+961', '+266', '+231', '+218', '+423', '+370', '+352', '+853', '+261', '+265', '+60', '+960', '+223', '+356', '+44-1624', '+692', '+596', '+222', '+230', '+52', '+691', '+373', '+377', '+976', '+382', '+1-664', '+212', '+258', '+95', '+264', '+674', '+977', '+31', '+687', '+64', '+505', '+227', '+234', '+683', '+850', '+389', '+=1-670', '+47', '+968', '+92', '+680', '+970', '+507', '+675', '+595', '+51', '+63', '+870', '+48', '+351', '+1-787', '+974', '+40', '+250', '+290', '+1-869', '+1-758', '+508', '+1-784', '+685', '+378', '+239', '+966', '+221', '+381', '+248', '+232', '+65', '+1721', '+421', '+386', '+677', '+252', '+27', '+82', '+211', '+34', '+94', '+249', '+597', '+46', '+41', '+963', '+886', '+992', '+255', '+66', '+1-242', '+670', '+228', '+690', '+676', '+1-868', '+216', '+90', '+993', '+1-649', '+688', '+256', '+380', '+971', '+44', '+598', '+998', '+678', '+379', '+58', '+1-284', '+1-340', '+681', '+967', '+260', '+263')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone_code" "public"."users_phone_code_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_code"`);
        await queryRunner.query(`DROP TYPE "public"."users_phone_code_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
    }

}
