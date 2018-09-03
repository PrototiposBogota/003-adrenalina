class CreateMaterialApoyos < ActiveRecord::Migration[5.2]
  def change
    create_table :material_apoyos do |t|
      t.string :titulo, limit: 50
      t.text :descripcion, limit: 300
      t.string :ruta_archivo, limit: 150
      t.string :tipo_archivo, limit: 50

      t.timestamps
    end
  end
end
