class CreateInstituciones < ActiveRecord::Migration[5.2]
  def change
    create_table :instituciones do |t|
      t.string :nombre, limit: 100
      t.text :descripcion, limit: 300
      t.text :direccion, limit: 100
      t.string :telefono, limit: 20
      t.string :web, limit: 50

      t.timestamps
    end
  end
end
