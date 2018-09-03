class CreateClasificaciones < ActiveRecord::Migration[5.2]
  def change
    create_table :clasificaciones do |t|
      t.string :nombre, limit: 50

      t.timestamps
    end
  end
end
