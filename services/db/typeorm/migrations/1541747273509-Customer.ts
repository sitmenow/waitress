import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Customer1541747273509 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const table = new Table({
        name: "customer",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "first_name",
            type: "varchar",
          },
          {
            name: "last_name",
            type: "varchar",
          },
        ]
      });

      await queryRunner.createTable(table, true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropTable("customer");
    }

}
