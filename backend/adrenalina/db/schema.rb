# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_07_30_013533) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "clasificaciones", force: :cascade do |t|
    t.string "nombre", limit: 50
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "colegios", force: :cascade do |t|
    t.string "nombre", limit: 50
    t.float "coordenadaX"
    t.float "coordenadaY"
    t.bigint "localidad_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["localidad_id"], name: "index_colegios_on_localidad_id"
  end

  create_table "eventos", force: :cascade do |t|
    t.string "titulo", limit: 100
    t.text "descripcion"
    t.date "fecha"
    t.time "hora"
    t.string "lugar", limit: 70
    t.binary "imagen"
    t.bigint "localidad_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["localidad_id"], name: "index_eventos_on_localidad_id"
  end

  create_table "instituciones", force: :cascade do |t|
    t.string "nombre", limit: 100
    t.text "descripcion"
    t.text "direccion"
    t.string "telefono", limit: 20
    t.string "web", limit: 50
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "localidads", force: :cascade do |t|
    t.string "nombre", limit: 20
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "material_apoyos", force: :cascade do |t|
    t.string "titulo", limit: 50
    t.text "descripcion"
    t.string "ruta_archivo", limit: 150
    t.string "tipo_archivo", limit: 50
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notificaciones", force: :cascade do |t|
    t.string "nombre", limit: 10
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "perfiles", force: :cascade do |t|
    t.string "nombre", limit: 10
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "perfils", force: :cascade do |t|
    t.string "nombre", limit: 10
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "usuarios", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "localidad_id"
    t.bigint "perfil_id"
    t.bigint "colegio_id"
    t.index ["colegio_id"], name: "index_usuarios_on_colegio_id"
    t.index ["email"], name: "index_usuarios_on_email", unique: true
    t.index ["localidad_id"], name: "index_usuarios_on_localidad_id"
    t.index ["perfil_id"], name: "index_usuarios_on_perfil_id"
    t.index ["reset_password_token"], name: "index_usuarios_on_reset_password_token", unique: true
  end

  add_foreign_key "colegios", "localidads"
  add_foreign_key "eventos", "localidads"
  add_foreign_key "usuarios", "colegios"
  add_foreign_key "usuarios", "localidads"
  add_foreign_key "usuarios", "perfils"
end
