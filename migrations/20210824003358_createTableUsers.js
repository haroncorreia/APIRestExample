
exports.up = function(knex) {
    
    return knex.schema.createTable("users", (table) => {
        table.increments("id");
        table.string("cpf", 11).notNull().unique();
        table.string("email", 100).notNull().unique();
        table.string("password", 100).notNull();
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.string("createdBy", 100);
        table.timestamp("updatedAt").nullable().defaultTo(null);
        table.string("updatedBy", 100);
        table.timestamp("deletedAt").nullable().defaultTo(null);
        table.string("deletedBy", 100);
        table.timestamp("restoredAt").nullable().defaultTo(null);
        table.string("restoredBy", 100);
    });

};

exports.down = function(knex) {
    return knex.schema.dropTable("users");
};
