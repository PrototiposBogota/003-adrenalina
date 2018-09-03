class AddColegioIdToUsuarios < ActiveRecord::Migration[5.2]
  def change
    add_reference :usuarios, :colegio, foreign_key: true
  end
end
