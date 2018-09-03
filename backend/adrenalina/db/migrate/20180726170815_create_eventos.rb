class CreateEventos < ActiveRecord::Migration[5.2]
  def change
    create_table :eventos do |t|
      t.string :titulo, limit: 100
      t.text :descripcion, limit: 300
      t.date :fecha
      t.time :hora
      t.string :lugar, limit: 70
      t.binary :imagen
      t.references :localidad, foreign_key: true

      t.timestamps
    end
  end
end
