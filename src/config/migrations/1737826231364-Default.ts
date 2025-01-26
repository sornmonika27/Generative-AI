import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1737826231364 implements MigrationInterface {
    name = 'Default1737826231364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`milestones\` DROP FOREIGN KEY \`FK_f30d5502f6b3dcf5a63d6b92462\``);
        await queryRunner.query(`ALTER TABLE \`milestones\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`roadmaps\` ADD \`userId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`roadmaps\` ADD CONSTRAINT \`FK_29f718c5a5cb41f2266d21ba207\` FOREIGN KEY (\`userId\`) REFERENCES \`user_info\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roadmaps\` DROP FOREIGN KEY \`FK_29f718c5a5cb41f2266d21ba207\``);
        await queryRunner.query(`ALTER TABLE \`roadmaps\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`milestones\` ADD \`userId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`milestones\` ADD CONSTRAINT \`FK_f30d5502f6b3dcf5a63d6b92462\` FOREIGN KEY (\`userId\`) REFERENCES \`user_info\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
