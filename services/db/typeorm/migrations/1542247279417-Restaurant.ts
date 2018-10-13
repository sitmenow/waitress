import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";


export class Restaurant1542247279417 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const table = new Table({
        name: "restaurant",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true
          },
          {
            name: "name",
            type: "varchar",
          }
        ]
      });

      await queryRunner.createTable(table, true);

      const index = new TableIndex({
        name: "INDEX_RESTAURANT_NAME",
        columnNames: ["name"]
      });

      await queryRunner.createIndex("restaurant", index);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      const table = await queryRunner.getTable("restaurant");
      await queryRunner.dropIndex("restaurant", "INDEX_RESTAURANT_NAME");
      await queryRunner.dropTable("restaurant");
    }

}
