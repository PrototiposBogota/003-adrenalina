jQuery("#simulation")
  .on("click", ".s-522c3769-de76-4747-8c93-05d082e60c46 .click", function(event, data) {
    var jEvent, jFirer, cases;
    if(data === undefined) { data = event; }
    jEvent = jimEvent(event);
    jFirer = jEvent.getEventFirer();
    if(jFirer.is("#s-Hotspot_1")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/95adc887-3e85-4566-95d6-d7b6077c8c85",
                    "transition": {
                      "type": "slideright",
                      "duration": 700
                    }
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Hotspot_2")) {
      cases = [
        {
          "blocks": [
            {
              "condition": {
                "action": "jimEquals",
                "parameter": [ {
                  "datatype": "property",
                  "target": "#s-Input_1",
                  "property": "jimGetValue"
                },"usuario" ]
              },
              "actions": [
                {
                  "action": "jimSetValue",
                  "parameter": {
                    "target": [ "#s-Paragraph_1" ],
                    "value": "Se enviará un e-mail con la información para recuperar su contraseña. "
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            },
            {
              "actions": [
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-522c3769-de76-4747-8c93-05d082e60c46 #s-Label_32 > .backgroundLayer": {
                      "attributes": {
                        "border-top-color": "#FF0000",
                        "border-right-color": "#FF0000",
                        "border-bottom-color": "#FF0000",
                        "border-left-color": "#FF0000"
                      }
                    }
                  },{
                    "#s-522c3769-de76-4747-8c93-05d082e60c46 #s-Label_32": {
                      "attributes-ie": {
                        "border-top-color": "#FF0000",
                        "border-right-color": "#FF0000",
                        "border-bottom-color": "#FF0000",
                        "border-left-color": "#FF0000"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimSetValue",
                  "parameter": {
                    "target": [ "#s-Text_1" ],
                    "value": "Usuario no encontrado, corrija el e-mail."
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Input_1")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimSetValue",
                  "parameter": {
                    "target": [ "#s-Input_1" ],
                    "value": ""
                  },
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-522c3769-de76-4747-8c93-05d082e60c46 #s-Label_32 > .backgroundLayer": {
                      "attributes": {
                        "border-top-color": "#FFFFFF",
                        "border-right-color": "#FFFFFF",
                        "border-bottom-color": "#FFFFFF",
                        "border-left-color": "#FFFFFF"
                      }
                    }
                  },{
                    "#s-522c3769-de76-4747-8c93-05d082e60c46 #s-Label_32": {
                      "attributes-ie": {
                        "border-top-color": "#FFFFFF",
                        "border-right-color": "#FFFFFF",
                        "border-bottom-color": "#FFFFFF",
                        "border-left-color": "#FFFFFF"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimSetValue",
                  "parameter": {
                    "target": [ "#s-Text_1" ],
                    "value": ""
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    }
  });