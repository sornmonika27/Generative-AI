import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1737826092515 implements MigrationInterface {
    name = 'Default1737826092515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`milestones\` ADD \`userId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD \`userId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`milestones\` ADD CONSTRAINT \`FK_f30d5502f6b3dcf5a63d6b92462\` FOREIGN KEY (\`userId\`) REFERENCES \`user_info\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD CONSTRAINT \`FK_122eef46f116c513a2ba12ad631\` FOREIGN KEY (\`userId\`) REFERENCES \`user_info\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP FOREIGN KEY \`FK_122eef46f116c513a2ba12ad631\``);
        await queryRunner.query(`ALTER TABLE \`milestones\` DROP FOREIGN KEY \`FK_f30d5502f6b3dcf5a63d6b92462\``);
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`milestones\` DROP COLUMN \`userId\``);
    }

}
