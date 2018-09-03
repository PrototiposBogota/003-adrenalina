class CreateColegios < ActiveRecord::Migration[5.2]
  def change
    create_table :colegios do |t|
      t.string :nombre, limit: 50
      t.float :coordenadaX
      t.float :coordenadaY
      t.references :localidad, foreign_key: true

      t.timestamps
    end
  end
end
