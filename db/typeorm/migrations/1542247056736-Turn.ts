import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table
} from "typeorm";

export class Turn1542247056736 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const table = new Table({
        name: "turn",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "branch_id",
            type: "uuid",
          },
          {
            name: "customer_id",
            type: "uuid",
          },
          {
            name: "created_at",
            type: "timestamp",
          },
          {
            name: "updated_at",
            type: "timestamp",
          },
          {
            name: "status",
            type: "varchar",
          }
        ]
      });

      await queryRunner.createTable(table, true);

      await queryRunner.createForeignKey(
        "turn",
        new TableForeignKey({
          name: "FK_TURN_BRANCH",
          columnNames: ["branch_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "branch",
        }));

      await queryRunner.createForeignKey(
        "turn",
        new TableForeignKey({
          name: "FK_TURN_CUSTOMER",
          columnNames: ["customer_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "customer",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      const table = await queryRunner.getTable("turn");
      await queryRunner.dropForeignKey("turn", "FK_TURN_BRANCH");
      await queryRunner.dropForeignKey("turn", "FK_TURN_CUSTOMER");
      await queryRunner.dropTable("turn");
    }
}
