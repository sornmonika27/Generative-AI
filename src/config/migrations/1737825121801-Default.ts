import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1737825121801 implements MigrationInterface {
    name = 'Default1737825121801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`milestones\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`roadmapId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roadmaps\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quizzes\` (\`id\` varchar(36) NOT NULL, \`question\` varchar(255) NOT NULL, \`options\` text NOT NULL, \`correctAnswer\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`milestones\` ADD CONSTRAINT \`FK_17e022d167f4860adfaf3332326\` FOREIGN KEY (\`roadmapId\`) REFERENCES \`roadmaps\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`milestones\` DROP FOREIGN KEY \`FK_17e022d167f4860adfaf3332326\``);
        await queryRunner.query(`DROP TABLE \`quizzes\``);
        await queryRunner.query(`DROP TABLE \`roadmaps\``);
        await queryRunner.query(`DROP TABLE \`milestones\``);
    }

}
