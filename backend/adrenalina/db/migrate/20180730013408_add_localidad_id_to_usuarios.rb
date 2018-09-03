class AddLocalidadIdToUsuarios < ActiveRecord::Migration[5.2]
  def change
    add_reference :usuarios, :localidad, foreign_key: true
  end
end
