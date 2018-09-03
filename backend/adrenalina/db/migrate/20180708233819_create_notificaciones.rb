class CreateNotificaciones < ActiveRecord::Migration[5.2]
  def change
    create_table :notificaciones do |t|
      t.string :nombre, limit: 10

      t.timestamps
    end
  end
end
