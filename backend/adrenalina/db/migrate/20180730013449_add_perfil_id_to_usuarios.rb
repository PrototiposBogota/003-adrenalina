class AddPerfilIdToUsuarios < ActiveRecord::Migration[5.2]
  def change
    add_reference :usuarios, :perfil, foreign_key: true
  end
end
