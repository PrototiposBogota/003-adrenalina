require 'test_helper'

class LocalidadsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @localidad = localidads(:one)
  end

  test "should get index" do
    get localidads_url
    assert_response :success
  end

  test "should get new" do
    get new_localidad_url
    assert_response :success
  end

  test "should create localidad" do
    assert_difference('Localidad.count') do
      post localidads_url, params: { localidad: { nombre: @localidad.nombre } }
    end

    assert_redirected_to localidad_url(Localidad.last)
  end

  test "should show localidad" do
    get localidad_url(@localidad)
    assert_response :success
  end

  test "should get edit" do
    get edit_localidad_url(@localidad)
    assert_response :success
  end

  test "should update localidad" do
    patch localidad_url(@localidad), params: { localidad: { nombre: @localidad.nombre } }
    assert_redirected_to localidad_url(@localidad)
  end

  test "should destroy localidad" do
    assert_difference('Localidad.count', -1) do
      delete localidad_url(@localidad)
    end

    assert_redirected_to localidads_url
  end
end
