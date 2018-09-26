(function(window, undefined) {
  var dictionary = {
    "5505e890-c686-403b-a078-a69f10d7761e": "Menu_TDrogas",
    "81bbb4e8-1e27-442c-a27c-8670555668a3": "Menu_Agenda",
    "9ec51105-4f3c-4243-929c-4044bf242540": "Registro",
    "bfd5de64-41c6-4e3d-8bb2-424c96e1835d": "Menu_Ruta",
    "90b35251-edd0-4b15-87f6-7ed16e699735": "Menu_Denunciar",
    "522c3769-de76-4747-8c93-05d082e60c46": "Recuperar clave",
    "70bb128e-46f2-4626-8d71-4815e1caf146": "Pantalla_Carga",
    "95adc887-3e85-4566-95d6-d7b6077c8c85": "Login",
    "f79badfd-1fed-4cfd-8a8a-3b14a6aa4e42": "Menu_Apoyo",
    "a7532e3e-aef7-4bf4-b125-8f587d8bc405": "Menu_Principal2",
    "64d0caeb-7f24-4d4c-a830-d41e2a794a54": "Menu_Datos",
    "adde8e28-1fc7-417c-8d5c-1a65ad6fe3ff": "Menu_ChatAyuda",
    "1e8a452c-0c3e-434b-9a69-9f88c989dab1": "Template 1",
    "e92653f6-fc08-4990-b43a-a9cb2f11f3f4": "Tipos de drogas",
    "d518c334-8183-4fc8-ae21-5f562bd082fe": "Agenda de eventos",
    "9dd89a87-edef-4ab4-a947-a8bb9266938c": "menu_principal",
    "228ff618-c7c6-4db9-b57b-3e2c55f545d8": "Masterfull",
    "32b6da6d-038a-4987-9ce9-b323bfb60887": "Ruta de Accion",
    "ba33a4ab-c620-42cc-a28d-ab23546378d9": "Chat de ayuda",
    "33dd5c1e-4371-4775-b304-355766b16e2d": "Denuncia",
    "98b44083-2910-42f7-8848-b8d2d0f64e84": "Instituciones de apoyo",
    "default": "default"
  };

  var uriRE = /^(\/#)?(screens|templates|masters|scenarios)\/(.*)(\.html)?/;
  window.lookUpURL = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, url;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      url = folder + "/" + canvas;
    }
    return url;
  };

  window.lookUpName = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, canvasName;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      canvasName = dictionary[canvas];
    }
    return canvasName;
  };
})(window);