class CreateLocalidads < ActiveRecord::Migration[5.2]
  def change
    create_table :localidads do |t|
      t.string :nombre, limit: 20

      t.timestamps
    end
  end
end
