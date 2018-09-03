class Colegio < ApplicationRecord
  belongs_to :localidad
  has_many :usuarios
end
