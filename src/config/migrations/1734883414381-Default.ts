import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1734883414381 implements MigrationInterface {
    name = 'Default1734883414381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`User_Info\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`userEmail\` varchar(255) NOT NULL, \`userContact\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NULL DEFAULT 'user', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifiedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`User_Info\``);
    }

}
