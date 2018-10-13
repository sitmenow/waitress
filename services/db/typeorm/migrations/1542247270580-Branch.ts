import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table
} from "typeorm";

export class Branch1542247270580 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const table = new Table({
        name: "branch",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "restaurant_id",
            type: "uuid",
          },
          {
            name: "is_open",
            type: "boolean",
          }
        ]
      });

      await queryRunner.createTable(table, true);

      const foreignKey = new TableForeignKey({
        name: "FK_BRANCH_RESTAURANT",
        columnNames: ["restaurant_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "restaurant",
      });

      await queryRunner.createForeignKey("branch", foreignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      const table = await queryRunner.getTable("branch");
      await queryRunner.dropForeignKey("question", "FK_BRANCH_RESTAURANT");
      await queryRunner.dropTable("branch");
    }

}
