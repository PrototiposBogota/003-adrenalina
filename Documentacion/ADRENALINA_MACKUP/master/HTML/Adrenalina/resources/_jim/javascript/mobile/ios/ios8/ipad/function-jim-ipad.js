/*!
 * Copyright 2013 Justinmind. All rights reserved.
 */

(function(window, undefined) {
	

	var ipad = {
		letters : [
			[ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "backspace" ],
			[ "a", "s", "d", "f", "g", "h", "j", "k", "l", "return" ],
			[ "shiftLeft", "z", "x", "c", "v", "b", "n", "m", ",", ".", "shiftRight" ], 
			[ "numbersLeft", "space", "numbersRight", "exit" ] 
		],
		numbers : [
			[ "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace" ],
			[ "&#150;", "&#47;", "&#58;", "&#59;", "&#40;", "&#41;", "&#36;", "&#38;", "&#64;", "return" ],
			[ "signsLeft", "undo", "&#46;", "&#44;", "&#63;", "&#33;", "&#39;", "&#34;", "signsRight" ],
			[ "lettersLeft", "space", "lettersRight", "exit" ]
		],
		signs: [
			[ "&#91;", "&#93;", "&#123;", "&#125;", "&#35;", "&#37;", "&#136;", "&#42;", "&#43;", "&#61;", "backspace" ],
			[ "&#95;", "&#92;", "&#124;", "&#126;", "&#60;", "&#62;", "&#128;", "&#163;", "&#165;", "return" ],
			[ "numbersLeft", "redo", "&#46;", "&#44;", "&#63;", "&#33;", "&#39;", "&#34;", "numbersRight" ],
			[ "lettersLeft", "space", "lettersRight", "exit" ]
		],
		emailurl : [
			[ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "backspace" ],
			[ "a", "s", "d", "f", "g", "h", "j", "k", "l", "return" ],
			[ "shiftLeft", "z", "x", "c", "v", "b", "n", "m", "&#64;", ".", "shiftRight" ], 
			[ "numbersLeft", "space", "&#95;", "&#150;", "exit" ] 
		]
	},
	months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
	daysCompressed = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ],
	monthsCompressed = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
	periods = [ "AM", "PM" ],
	input,
	initialInputValue,
	pressedTarget,
	ddSize,
	startDDPos,
	dragStart=false,
	lastKeyboard = "#letters",
	userAgent = navigator.userAgent;
	
	function createKeyboard() {
		var key="";
		var html = '<div id='+controller.keyboardKey.substring(1) +' onselectstart="return false;">';
		$.each(ipad, function(key, value) {
			html += ('<div id="' + key + '">');
			$.each(this, function(key, value) {
				html += '<ul>';
				$.each(this, function(key, value) {
					html += ('<li class="' + value + '"></li>');
				});
				html += '</ul>';
			});
			html += '</div>';
		});
		html += '</div>';
		
		jQuery("#jim-container").append(html);
	}
	
	function bindKeyboard() {
		jQuery(controller.keyboardKey).on("mouseup", function(event, data) {
			var $realTarget = event.target;
			if (event.target.tagName === "SPAN") {
				$realTarget = jQuery(event.target.parentElement.parentElement).context;
			}
			if ($realTarget.tagName === "LI" && $realTarget===pressedTarget) {
				var key = $realTarget.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				
				if(key) {
					switch(key){
						case "lettersRight":
						case "lettersLeft":
							jQuery("#letters").css('display', 'none');
							jQuery("#numbers").css('display', 'none');
							jQuery("#signs").css('display', 'none');
							jQuery("#emailurl").css('display', 'none');
							jQuery(lastKeyboard).css('display', 'block');
							deactivateSpecialKeys();
							break;
						case "numbersRight":
						case "numbersLeft":
							jQuery("#numbers").css('display', 'block');
							jQuery("#signs").css('display', 'none');
							jQuery("#letters").css('display', 'none');
							jQuery("#emailurl").css('display', 'none');
							deactivateSpecialKeys();
							break;
						case "signsRight":
						case "signsLeft":
							jQuery("#signs").css('display', 'block');							
							jQuery("#letters").css('display', 'none');
							jQuery("#emailurl").css('display', 'none');
							jQuery("#numbers").css('display', 'none');
							deactivateSpecialKeys();
							break;
						case "undo":
						case "redo":
							break;
						default:
							changeValueByKeyboard(input, key);
							break;
					}
				}
			}
			removeEffects($realTarget);
			removeEffects(pressedTarget);
		});
		
		jQuery(controller.keyboardKey).on("mousedown", function(event, data) {
			var realTarget = event.target || event.srcElement;
			pressedTarget = realTarget;
			if (realTarget.tagName === "LI") {
				var key = realTarget.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				
				switch(key) {
					case "shiftRight":
					case "shiftLeft":
					case "lettersRight":
					case "lettersLeft":
					case "numbersRight":
					case "numbersLeft":
					case "signsRight":
					case "signsLeft":
						break;
					default:
						$target = jQuery(pressedTarget);
						$target.removeClass("pressed").addClass("pressed");
						break;
				}
				event.preventDefault();
			}
		});
		
		jQuery(controller.keyboardKey).on("dblclick", function(event, data) {
			if (event.target.tagName === "LI") {
				var key = event.target.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				if(key === "shiftRight" || key === "shiftLeft") {
					var hasCaps = jQuery(".shiftLeft.caps");
					var hasCapsLock = jQuery(".shiftLeft.capsLock");
					if(hasCaps.length>0)
						jQuery(".shiftLeft, .shiftRight").removeClass("caps").addClass("capsLock");
					else if(hasCapsLock.length>0)
						jQuery(".shiftLeft, .shiftRight").removeClass("capsLock");
					else 
						jQuery(".shiftLeft, .shiftRight").addClass("capsLock");
				}
			}
		});
		
		jQuery(controller.keyboardKey).on("mouseleave", function(event, data) {
		  if(pressedTarget) {
			removeEffects(pressedTarget);
		    pressedTarget=null;
		  }
		});
	}

	function deactivateSpecialKeys() {
		jQuery(".shift").removeClass("caps").removeClass("capsLock");
	}
	
	function removeEffects(target) {
		jQuery(target).removeClass("pressed");
	}

	function changeValueByKeyboard($target, newKey) {
		var action, type, oldValue = "", startPos=0;
	    type = $target.jimGetType();
		switch(type) {
		  case itemType.text:
		  case itemType.password:
			oldValue = $target.find("input").val();
			startPos = $target.find("input").caret().start;
			action = applyNewValue(oldValue, newKey, $target.find("input"));
			if(action.key==="return")
				$target.find("input").val(jimUtil.fromHTML(action.newValue));
			else $target.find("input").val(jimUtil.fromHTML(action.newValue)).caret({start: startPos+action.caretDespl, end:startPos+action.caretDespl});
			break;
		  case itemType.textarea:
			oldValue = $target.find("textarea").val();
			startPos = $target.find("textarea").caret().start;
			action = applyNewValue(oldValue, newKey, $target.find("textarea"));
			if(action.key==="return") 
				$target.find("textarea").val(jimUtil.fromHTML(action.newValue));
			else $target.find("textarea").val(jimUtil.fromHTML(action.newValue)).caret({start: startPos+action.caretDespl, end:startPos+action.caretDespl});
			break;
		}
		input.closest(".firer").trigger("keyup.jim", [{"preventTrigger": true, "altKey":false, "ctrlKey":false, "shiftKey":false, "which": (newKey.startsWith("return")) ? 13 : newKey.toLowerCase().charCodeAt(0)-32 }]);
	}

	function applyNewValue(oldValue, newKey, $target) {
		var newValue, hasCaps, beforeCaret, afterCaret, caretDespl;
		newValue=oldValue;
		hasCaps = jQuery(".shiftRight.caps, .shiftRight.capsLock");
		if(newKey.indexOf(" ")>0)
			newKey=newKey.substring(0, newKey.indexOf(" "));
		if(hasCaps.length>0 && newKey.length===1)
			newKey = newKey.toUpperCase();
			
		//calculate value before and after caret	
		beforeCaret = oldValue.substring(0, $target.caret().start);
		afterCaret = oldValue.substring($target.caret().end);
			
		switch(newKey) {
			case "space":
				newValue = beforeCaret + " " + afterCaret;
				caretDespl = 1;
				break;
			case "backspace":
				newValue = (beforeCaret.length>0) ? beforeCaret.substring(0, beforeCaret.length-1) : "";
				newValue += afterCaret; 
				caretDespl = -1;
				break;
			case "shiftRight":
			case "shiftLeft":
				if(hasCaps.length>0)
					jQuery(".shiftLeft, .shiftRight").removeClass("caps").removeClass("capsLock");
				else jQuery(".shiftLeft, .shiftRight").addClass("caps");
				caretDespl = 0;
				break;
			case "return":
			case "exit":
				slideKeyboard(jQuery(controller.keyboardKey), false);
				deactivateSpecialKeys();
				if(initialInputValue!==newValue) {
					input.closest(".firer").trigger("change");
				}
				input.find("input:focus").blur();
				caretDespl = 0;
				break;
			case ".":
				if(jQuery(".shiftRight.caps").length>0)
					newKey="?";
				newValue = beforeCaret + newKey + afterCaret;
				jQuery(".shiftLeft, .shiftRight").removeClass("caps");
				caretDespl = 1;
				break;
			case ",":
				if(jQuery(".shiftRight.caps").length>0)
					newKey="!";
				newValue = beforeCaret + newKey + afterCaret;
				jQuery(".shiftLeft, .shiftRight").removeClass("caps");
				caretDespl = 1;
				break;
			default:
				newValue = beforeCaret + newKey + afterCaret;
				jQuery(".shiftLeft, .shiftRight").removeClass("caps");
				caretDespl = 1;
				break;
		}
		
		return {newValue: newValue, caretDespl: caretDespl, key: newKey};
	}

	function setStartCaretPosition($target) {
		var endPos=0;
		type = $target.jimGetType();
		switch(type) {
		  case itemType.text:
		  case itemType.password:
			endPos = $target.find("input").val().length;
			$target.find("input").caret({start: endPos, end: endPos});
			break;
		  case itemType.textarea:
			endPos = $target.find("textarea").val().length;
			$target.find("textarea").caret({start: endPos, end: endPos});
			break;
		}
	}
	
	/*********************** END KEYBOARD METHODS ************************/
	
	/*********************** START DROPDOWN METHODS ************************/
	
	function createDropDown() {
		var html = '<div id='+controller.dropdownKey.substring(1) +' onselectstart="return false;"><div id="jim-ipad-dd_options"><div class="dd_options"></div></div></div>';
		jQuery("#jim-container").append(html);
		jQuery(controller.dropdownKey+' #jim-ipad-dd_options .dd_options').draggable({ 
			axis: "y",
			drag: function(evt, ui) {
				var zoom = jimDevice.getZoom();
				ui.position.top = startDDPos + (ui.position.top-startDDPos) * zoom;
			}
		});
	}
	
	function bindDropDown() {
		jQuery(controller.dropdownKey).on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
			}
			else if (event.target.tagName === "DIV" && !dragStart) {
				var key = event.target.className;
				if(key==="")
					key = event.target.id;
				if(key) {
					if(key.indexOf(" ")>0)
						key=key.substring(0, key.indexOf(" "));
					switch(key) {
					case "dd_options":
					case "tock":
					case"jim-ipad-dd_options":
						//case for IE on option without value
						if(jQuery(".dd_options .pressed").position()===undefined)
							break;
						case "options":
							jQuery(controller.dropdownKey+" .dd_options .selected").removeClass("selected");
							var $target = jQuery(controller.dropdownKey+" .dd_options .pressed");
							$target.removeClass("pressed").addClass("selected");
							jQuery(controller.dropdownKey+" .dd_options .tock").remove();
							$target.append('<div class="tick"></div>');
							setDropDrownValue(input);
							var value = $target.text();
							if(initialInputValue!==value) {
								input.closest(".firer").trigger("change");
								initialInputValue = value;
							}
							jQuery(controller.dropdownKey).fadeOut(300);
							jQuery("#jim-ipad-mask").css('display', 'none');
							jQuery(".nativedropdown").removeClass("pressed");
							break;
						default:
							break;
					}
				}
			}
		});
		
		jQuery(controller.dropdownKey).on("mousedown", function(event, data) {
			if (event.target.tagName === "DIV" && !dragStart) {
				var key = event.target.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				switch(key) {
					case "tick":
					case "tock":
						//case for IE on option without value
					case "options":
						var $target = jQuery(event.target).closest(".options"),
						$currentPressed = jQuery(controller.dropdownKey+" .dd_options .selected");
						
						if($target[0]===$currentPressed[0]) {
							jQuery(controller.dropdownKey+" #jim-ipad-dd_options .dd_options .tick").removeClass("tick").addClass("tock");
							jQuery(controller.dropdownKey+" #jim-ipad-dd_options .dd_options .pressed").removeClass("pressed");
							$target.parent().removeClass("pressed").addClass("pressed");
						}
						else {
							jQuery(controller.dropdownKey+" #jim-ipad-dd_options .dd_options .tick").removeClass("tick").addClass("tock").hide();
							jQuery(controller.dropdownKey+" #jim-ipad-dd_options .dd_options .pressed").removeClass("pressed");
							$target.parent().removeClass("pressed").addClass("pressed");			
						}
						break;
					default:
						break;
				}
				event.preventDefault();
			}
		});
		
		jQuery(controller.dropdownKey).on("dragstart", function(event, data) {
			jQuery(controller.dropdownKey+" .dd_options .pressed").removeClass("pressed");
			jQuery(controller.dropdownKey+" .dd_options .tock").removeClass("tock").addClass("tick").show();
			startDDPos = parseInt(jQuery(controller.dropdownKey+" .dd_options").css("top"), 10);
			dragStart = true;
		});
		
		jQuery(controller.dropdownKey).on("drag", function(event, data) {
			if(dragStart) {
				var offset = jQuery(controller.dropdownKey+" #jim-ipad-dd_options").offset(),
				dd_width = parseInt(jQuery(controller.dropdownKey+" #jim-ipad-dd_options").css('width')),
				dd_height = parseInt(jQuery(controller.dropdownKey+" #jim-ipad-dd_options").css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery(controller.dropdownKey+" .dd_options").animate({ "top" : (-(44*(ddSize-4))) +"px"});
					dragStart=false;
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery(controller.dropdownKey+" .dd_options").animate({ "top" : "0px"});
					dragStart=false;
				}
			}
			
		});
		
	}
	
	function fillDropDownOptions($target) {
		var type = $target.jimGetType();
		jQuery(controller.dropdownKey+" .dd_options >").remove();
		switch(type) {
			case itemType.dropdown:
			case itemType.nativedropdown:
				var html = "";
				$holder = jQuery("#"+$target.attr("id"));
	            $options = $holder.find(".option");
	            ddSize = $options.length;
	            defaultValue = $target.find(".valign").children(".value").text();
	            var newOption, selectedPos;
	            for(i=0, iLen=ddSize; i<iLen; i+=1) {
	            	newOption = "<div class='line_options";
	            	if(defaultValue === jQuery($options[i]).text()) {
	            		selectedPos = i;
	            		newOption += " selected'><div class='options'>" + jQuery($options[i]).text() + "<div class='tick'></div></div></div>";
	            	}
	            	else {
	            		newOption += "'><div class='options'>" + jQuery($options[i]).text() + "</div></div>";
	            	}
	            	html += newOption;
	            }
				jQuery(controller.dropdownKey+" .dd_options").append(html);
				if(selectedPos==0)
					selectedPos=1;
				else if(selectedPos+1==ddSize)
					selectedPos-=1;
				
				if(selectedPos>=0 && selectedPos>3) {
					jQuery(controller.dropdownKey+" .dd_options").css("top", -(selectedPos*44)+44 + "px");
				}
				break;
		}
	}
	
	function setDropDrownValue($target) {
		var type = $target.jimGetType();
		switch(type) {
			case itemType.dropdown:
			case itemType.nativedropdown:
				$options = $target.children(".dropdown-options").children(".option").removeClass("selected").removeAttr("selected");
				var value = jQuery(controller.dropdownKey+" .dd_options .line_options.selected .options").text();
				for(o=0, oLen=$options.length; o<oLen; o+=1) {
				  option = $options[o];
				  if(option.textContent === value || option.innerText === value) {
				    jQuery(option).addClass("selected");
				    jQuery(option).attr("selected","selected");
				    $target.find(".value").html(jimUtil.toHTML(value));
				    return false;
				  }
				}
				break;
		}
	}
	
	/*********************** END DROPDOWN METHODS ************************/
	
	/*********************** START DATE METHODS ************************/
	
	function createDate() {
		var html = "";
		if($.browser.msie)
			html = '<div id='+controller.dateKey.substring(1)+'><div id="jim-ipad-da_controls"><div class="da_controls-clear">Clear</div></div><div><div class="jim-ipad-da_mask"></div><div id="jim-ipad-da_options"><div class="da_months"></div><div class="da_days"></div><div class="da_years"></div></div><div id="jim-ipad-da_options_big"><div class="da_months"></div><div class="da_days"></div><div class="da_years"></div></div></div></div>';
		else html = '<div id='+controller.dateKey.substring(1)+'><div id="jim-ipad-da_controls"><div class="da_controls-clear">Clear</div></div><div><div id="jim-ipad-da_options"><div class="da_months"></div><div class="da_days"></div><div class="da_years"></div></div><div id="jim-ipad-da_options_big"><div class="da_months"></div><div class="da_days"></div><div class="da_years"></div></div><div class="jim-ipad-da_mask"></div></div></div>';
		jQuery("#jim-container").append(html);
				
		jQuery(controller.dateKey+' .da_months').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery(controller.dateKey+' .da_days').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery(controller.dateKey+' .da_years').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
	}
	
	function bindDate() {
		bindDays();
		bindMonths();
		bindYears();
	}
	
	/** CONTROLS **/
	function bindDateControls() {
		jQuery(controller.dateKey).on("mouseup", function(event, data) {
			var realTarget = event.target || event.srcElement;
			if (realTarget.tagName === "DIV" && !dragStart) {
				var key = realTarget.className;
				if(key) {
					if(key.indexOf(" ")>0)
						key=key.substring(0, key.indexOf(" "));
					switch(key) {
						case "da_controls-clear":
							jQuery("#jim-ipad-da_controls .da_controls-clear").removeClass("pressed");
							input.find("input").val("");
							if(initialInputValue!=="") {
								input.closest(".firer").trigger("change");
								initialInputValue = "";
							}
							break;
						default:
							break;
					}
				}
			}
		});
		
		jQuery(controller.dateKey).on("mousedown", function(event, data) {
			var realTarget = event.target || event.srcElement;
			if (realTarget.tagName === "DIV" && !dragStart) {
				var key = realTarget.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				switch(key) {
					case "da_controls-clear":
						jQuery(event.target).removeClass("pressed").addClass("pressed");
						break;
					default:
						break;
				}
				event.preventDefault();
			}
		});
	}
	
	/** DAYS **/
	function bindDays() {
		jQuery(controller.dateKey+" .da_days").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var topPos = 210, topPosBig = 302;
				
				var ddTop = parseInt(jQuery("#jim-ipad-da_options .da_days").css('top'));
				if((ddTop+topPos)>14) {
					var offset = -topPos-ddTop-14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-da_options_big .da_days").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-da_options .da_days").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDADays(despl);
						jQuery("#jim-ipad-da_options .da_days").css('top', -topPos + 'px');
						jQuery("#jim-ipad-da_options_big .da_days").css('top', -topPosBig + 'px');
						autoCorrectDate();
					});
				}
				else if((ddTop+topPos)<-14) {
					var offset = -topPos-ddTop+14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-da_options_big .da_days").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-da_options .da_days").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDADays(despl);
						jQuery("#jim-ipad-da_options .da_days").css('top', -topPos + 'px');
						jQuery("#jim-ipad-da_options_big .da_days").css('top', -topPosBig + 'px');
						autoCorrectDate();
					});
				}
				else {
					jQuery("#jim-ipad-da_options_big .da_days").animate({'top' : -topPosBig + 'px', queue : false });
					jQuery("#jim-ipad-da_options .da_days").animate({'top': -topPos + 'px', queue : false }, function() {
						setDateValue();
					});
				}
			}
		});
		
		jQuery(controller.dateKey+' .da_days').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery(controller.dateKey+' .da_days').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-ipad-da_options .da_days").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-ipad-da_options .da_days").trigger('mouseup');
				}
				else {
					if(jQuery("#jim-ipad-da_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#jim-ipad-da_options_big .da_days").css("top", parseInt(jQuery("#jim-ipad-da_options .da_days").css('top'))-92 +"px");
					else jQuery("#jim-ipad-da_options .da_days").css("top", parseInt(jQuery("#jim-ipad-da_options_big .da_days").css('top'))+92 +"px");
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function autoCorrectDate() {
		var disabled = jQuery("#jim-ipad-da_options .da_days :nth-child(11)").hasClass("disabled");
		
		if(disabled) {
			moveDigits(jQuery("#jim-ipad-da_options .da_days :nth-child(11)"));
		}
		else setDateValue();
	}

	function moveDigits(disabledSelected) {
		var day = parseInt(disabledSelected.text());
		var disabledDays = 1;
		for(var i=11;i<=12;i++) {
			if(jQuery("#jim-ipad-da_options .da_days :nth-child(" + (jQuery("#jim-ipad-da_options .da_days").children().length-i) +")").hasClass("disabled"))
				disabledDays++;
		}
		
		var topPos = 210, topPosBig = 302;
		jQuery("#jim-ipad-da_options_big .da_days").animate({'top' : -topPosBig+(29*disabledDays)+'px', queue : false });
		jQuery("#jim-ipad-da_options .da_days").animate({'top' : -topPos+(29*disabledDays)+'px', queue : false }, function() {
			restoreDefaultDADays(-disabledDays);
			setDateValue();
		});
	}

	function restoreDefaultDADays(offset) {
		var firstDay = parseInt(jQuery("#jim-ipad-da_options .da_days :first-child").text(), 10),
		newStartDay = firstDay+offset;
		
		resetDADays(jQuery("#jim-ipad-da_options .da_days").children(), firstDay, newStartDay);
		resetDADays(jQuery("#jim-ipad-da_options_big .da_days").children(), firstDay, newStartDay);

		checkDate();
		var topPos = 210, topPosBig = 302;		
		jQuery("#jim-ipad-da_options .da_days").css('top', -topPos + 'px');
		jQuery("#jim-ipad-da_options_big .da_days").css('top', -topPosBig + 'px');

	}
	
	function resetDADays(currentDayList, firstDay, newStartDay) {
		for(var i=0; i<currentDayList.length; i++) {
			var item = jQuery(currentDayList[i]);
			var value = (newStartDay + i);
			value = (value+31)%31;
			if(value==0) value=31;
			var oldValue = (firstDay + i)
			oldValue = (oldValue+31)%31;
			if(oldValue==0) oldValue=31;
			
			
			item.removeClass("day" + oldValue);
			item.removeClass("disabled");
			item.addClass("day" + value);
			item.text(value);
		}
	}

	function checkDate() {
		var month = jQuery("#jim-ipad-da_options .da_months :nth-child(11)").text();
		var day = parseInt(jQuery("#jim-ipad-da_options .da_days :nth-child(11)").text(), 10);
		var year = parseInt(jQuery("#jim-ipad-da_options .da_years :nth-child(11)").text());
		jQuery("#jim-ipad-da_options .days").removeClass("disabled");
		
		monthPos = jQuery.inArray(month, months);
		if(monthPos<7 && monthPos%2===1) {
			jQuery("#jim-ipad-da_options .day31").addClass("disabled");
		}
		else if(monthPos>=7 && monthPos%2===0) {
			jQuery("#jim-ipad-da_options .day31").addClass("disabled");
		}
		
		if(month==="February") {
			jQuery("#jim-ipad-da_options .day30").addClass("disabled");
		}
		
		if(year%4!==0 && month==="February") {
			jQuery("#jim-ipad-da_options .day29").addClass("disabled");
		}
	}

	/** MONTHS **/
	function bindMonths() {
		jQuery(controller.dateKey+" .da_months").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var topPos = 210, topPosBig = 302;
				
				var ddTop = parseInt(jQuery("#jim-ipad-da_options .da_months").css('top'));
				if((ddTop+topPos)>14) {
					var offset = -topPos-ddTop-14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-da_options_big .da_months").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-da_options .da_months").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDAMonths(despl);
						jQuery("#jim-ipad-da_options .da_months").css('top', -topPos + 'px');
						jQuery("#jim-ipad-da_options_big .da_months").css('top', -topPosBig + 'px');
						autoCorrectDate();
					});
				}
				else if((ddTop+topPos)<-14) {
					var offset = -topPos-ddTop+14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-da_options_big .da_months").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-da_options .da_months").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDAMonths(despl);
						jQuery("#jim-ipad-da_options .da_months").css('top', -topPos + 'px');
						jQuery("#jim-ipad-da_options_big .da_months").css('top', -topPosBig + 'px');
						autoCorrectDate();
					});
				}
				else {
					jQuery("#jim-ipad-da_options_big .da_months").animate({'top' : -topPosBig + 'px', queue : false });
					jQuery("#jim-ipad-da_options .da_months").animate({'top': -topPos + 'px', queue : false }, function() {
						setDateValue();
					});
				}
			}
		});

		jQuery(controller.dateKey+' .da_months').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery(controller.dateKey+' .da_months').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-ipad-da_options .da_months").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-ipad-da_options .da_months").trigger('mouseup');
				}
				else {
					if(jQuery("#jim-ipad-da_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#jim-ipad-da_options_big .da_months").css("top", parseInt(jQuery("#jim-ipad-da_options .da_months").css('top'))-92 +"px");
					else jQuery("#jim-ipad-da_options .da_months").css("top", parseInt(jQuery("#jim-ipad-da_options_big .da_months").css('top'))+92 +"px");
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultDAMonths(offset) {
		var firstMonth = jQuery("#jim-ipad-da_options .da_months :first-child").text(),
		newStartMonth = jQuery.inArray(firstMonth, months)+offset,
		oldStartMonth = jQuery.inArray(firstMonth, months);
		
		resetDAMonths(jQuery("#jim-ipad-da_options .da_months").children(), newStartMonth, oldStartMonth);
		resetDAMonths(jQuery("#jim-ipad-da_options_big .da_months").children(), newStartMonth, oldStartMonth);

		checkDate();
		var topPos = 210, topPosBig = 302;		
		jQuery("#jim-ipad-da_options .da_months").css('top', -topPos + 'px');
		jQuery("#jim-ipad-da_options_big .da_months").css('top', -topPosBig + 'px');
	}
	
	function resetDAMonths(currentMonthList, newStartMonth, oldStartMonth) {
		for(var i=0; i<currentMonthList.length; i++) {
			var item = jQuery(currentMonthList[i]);
			var value = (newStartMonth + i);
			value = (value+12)%12;
			if(value==12) value=0;
			var oldValue = (oldStartMonth + i)
			oldValue = (oldValue+12)%12;
			if(oldValue==12) oldValue=0;
			
			item.removeClass("month" + oldValue);
			item.addClass("month" + value);
			item.text(months[value]);
		}
	}

	/** YEARS **/
	function bindYears() {
		jQuery(controller.dateKey+" .da_years").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var topPos = 210, topPosBig = 302;				
				var ddTop = parseInt(jQuery("#jim-ipad-da_options .da_years").css('top'));
				if((ddTop+topPos)>14) {
					var offset = -topPos-ddTop-14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-da_options_big .da_years").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-da_options .da_years").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDAYears(despl);
						jQuery("#jim-ipad-da_options .da_years").css('top', -topPos + 'px');
						jQuery("#jim-ipad-da_options_big .da_years").css('top', -topPosBig + 'px');
						autoCorrectDate();
					});
				}
				else if((ddTop+topPos)<-14) {
					var offset = -topPos-ddTop+14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-da_options_big .da_years").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-da_options .da_years").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDAYears(despl);
						jQuery("#jim-ipad-da_options .da_years").css('top', -topPos + 'px');
						jQuery("#jim-ipad-da_options_big .da_years").css('top', -topPosBig + 'px');
						autoCorrectDate();
					});
				}
				else {
					jQuery("#jim-ipad-da_options_big .da_years").animate({'top' : -topPosBig + 'px', queue : false });
					jQuery("#jim-ipad-da_options .da_years").animate({'top': -topPos + 'px', queue : false }, function() {
						setDateValue();
					});
				}
			}
		});
		
		jQuery(controller.dateKey+' .da_years').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery(controller.dateKey+' .da_years').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-ipad-da_options .da_years").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-ipad-da_options .da_years").trigger('mouseup');
				}
				else {
					if(jQuery("#jim-ipad-da_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#jim-ipad-da_options_big .da_years").css("top", parseInt(jQuery("#jim-ipad-da_options .da_years").css('top'))-92 +"px");
					else jQuery("#jim-ipad-da_options .da_years").css("top", parseInt(jQuery("#jim-ipad-da_options_big .da_years").css('top'))+92 +"px");
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultDAYears(offset) {
		var firstYear = parseInt(jQuery("#jim-ipad-da_options .da_years :first-child").text()),
		newStartYear = firstYear+offset;
		
		resetDAYears(jQuery("#jim-ipad-da_options .da_years").children(), firstYear, newStartYear);
		resetDAYears(jQuery("#jim-ipad-da_options_big .da_years").children(), firstYear, newStartYear);

		checkDate();
		var topPos = 210, topPosBig = 302;		
		jQuery("#jim-ipad-da_options .da_years").css('top', -topPos + 'px');
		jQuery("#jim-ipad-da_options_big .da_years").css('top', -topPosBig + 'px');
	}
	
	function resetDAYears(currentYearList, firstYear, newStartYear) {
		for(var i=0; i<currentYearList.length; i++) {
			var item = jQuery(currentYearList[i]);
			var value = (newStartYear + i);
			var oldValue = (firstYear + i)
			
			item.removeClass("year" + oldValue);
			item.addClass("year" + value);
			item.text(value);
		}
	}

	function fillDate() {
		var currentMonth, currentDay, currentYear, html = "";
		var currentValue = input.find("input").val();
		if(currentValue==="") {
			var currentDate = new Date();
			currentMonth = currentDate.getMonth();
			currentDay = currentDate.getDate();
			currentYear = currentDate.getFullYear();
		}
		else {
			currentMonth = parseInt(currentValue.substring(0, currentValue.indexOf("/")), 10)-1;
			currentDay = parseInt(currentValue.substring(currentValue.indexOf("/")+1, currentValue.lastIndexOf("/")), 10);
			currentYear = parseInt(currentValue.substring(currentValue.lastIndexOf("/")+1), 10);
		}
		
		//months
		for(var i=currentMonth-10;i<=currentMonth+10;i++) {
			var val = i;
			val = (val+12)%12;
			if(val===12) val=0;
			html += "<div class='months month" + val + "'>" + months[val] + "</div>";
		}
		jQuery(controller.dateKey+" .da_months").html(html);
		
		//days
		html = "";
		for(var i=currentDay-10;i<=currentDay+10;i++) {
			var val = i;
			val = (val+31)%31;
			if(val===0) val=31;
			html += "<div class='days day" + val + "'>" + val + "</div>"; 
		}
		jQuery(controller.dateKey+" .da_days").html(html);
		
		//years
		html = "";
		for(var i=currentYear-10;i<=currentYear+10;i++) {
			var val = i;
			html += "<div class='years year" + val + "'>" + val + "</div>"; 
		}
		jQuery(controller.dateKey+" .da_years").html(html);
		
		checkDate();
		setDateValue();
	}
	
	function setDateValue() {
		var month = jQuery(controller.dateKey+" #jim-ipad-da_options .da_months :nth-child(11)").text(),
		day = parseInt(jQuery(controller.dateKey+" #jim-ipad-da_options .da_days :nth-child(11)").text()),
		year = parseInt(jQuery(controller.dateKey+" #jim-ipad-da_options .da_years :nth-child(11)").text());
		var value = jQuery.inArray(month, months)+1;
		if(value.toString().length===1) value = "0" + value;
		if(day.toString().length===1) day = "0" + day;
		value = value + "/" + day + "/" + year;
		
		input.find("input").val(jimUtil.fromHTML(value));
		if(initialInputValue!==value) {
			input.closest(".firer").trigger("change");
			initialInputValue = value;
		}
	}
	
	/*********************** END DATE METHODS ************************/
	
	/*********************** START TIME METHODS ************************/
	
	function createTime() {
		var html = "";
		if($.browser.msie)
			html = '<div id='+controller.timeKey.substring(1)+'><div id="jim-ipad-ti_controls"><div class="ti_controls-clear">Clear</div></div><div><div class="jim-ipad-ti_mask"></div><div id="jim-ipad-ti_options"><div class="ti_hours"></div><div class="ti_minutes"></div><div class="ti_periods"></div></div><div id="jim-ipad-ti_options_big"><div class="ti_hours"></div><div class="ti_minutes"></div><div class="ti_periods"></div></div></div></div>';
		else html = '<div id='+controller.timeKey.substring(1)+'><div id="jim-ipad-ti_controls"><div class="ti_controls-clear">Clear</div></div><div><div id="jim-ipad-ti_options"><div class="ti_hours"></div><div class="ti_minutes"></div><div class="ti_periods"></div></div><div id="jim-ipad-ti_options_big"><div class="ti_hours"></div><div class="ti_minutes"></div><div class="ti_periods"></div></div><div class="jim-ipad-ti_mask"></div></div></div>';
		jQuery("#jim-container").append(html);
		
		jQuery(controller.timeKey+' .ti_hours').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery(controller.timeKey+' .ti_minutes').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery(controller.timeKey+' .ti_periods').draggable({ axis: "y" });
	}
	
	function bindTime() {
		bindTimeHours();
		bindTimeMinutes();
		bindTimePeriods();
	}
	
	/** CONTROLS **/
	function bindTimeControls() {
		jQuery(controller.timeKey).on("mouseup", function(event, data) {
			if (event.target.tagName === "DIV" && !dragStart) {
				var key = event.target.className;
				if(key) {
					if(key.indexOf(" ")>0)
						key=key.substring(0, key.indexOf(" "));
					switch(key) {
						case "ti_controls-clear":
							jQuery("#jim-ipad-ti_controls .ti_controls-clear").removeClass("pressed");
							clearTimeValue(input);
							break;
						default:
							break;
					}
				}
			}
		});
		
		jQuery(controller.timeKey).on("mousedown", function(event, data) {
			if (event.target.tagName === "DIV" && !dragStart) {
				var key = event.target.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				switch(key) {
					case "ti_controls-clear":	
						jQuery(event.target).removeClass("pressed").addClass("pressed");
						break;
					default:
						break;
				}
				event.preventDefault();
			}
		});
	}
	
	/** HOURS **/
	function bindTimeHours() {
		jQuery(controller.timeKey+" .ti_hours").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var topPos = 210, topPosBig = 302;
				
				var ddTop = parseInt(jQuery("#jim-ipad-ti_options .ti_hours").css('top'));
				if((ddTop+topPos)>14) {
					var offset = -topPos-ddTop-14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-ti_options_big .ti_hours").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-ti_options .ti_hours").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultTIHours(despl);
						jQuery("#jim-ipad-ti_options .ti_hours").css('top', -topPos + 'px');
						jQuery("#jim-ipad-ti_options_big .ti_hours").css('top', -topPosBig + 'px');
						setTimeValue(input);
					});
				}
				else if((ddTop+topPos)<-14) {
					var offset = -topPos-ddTop+14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-ti_options_big .ti_hours").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-ti_options .ti_hours").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultTIHours(despl);
						jQuery("#jim-ipad-ti_options .ti_hours").css('top', -topPos + 'px');
						jQuery("#jim-ipad-ti_options_big .ti_hours").css('top', -topPosBig + 'px');
						setTimeValue(input);
					});
				}
				else {
					jQuery("#jim-ipad-ti_options_big .ti_hours").animate({'top' : -topPosBig + 'px', queue : false });
					jQuery("#jim-ipad-ti_options .ti_hours").animate({'top': -topPos + 'px', queue : false }, function() {
						setTimeValue(input);
					});
				}
			}
		});

		jQuery(controller.timeKey+" .ti_hours").on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery(controller.timeKey+" .ti_hours").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-ipad-ti_options .ti_hours").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-ipad-ti_options .ti_hours").trigger('mouseup');
				}
				else {
					if(jQuery("#jim-ipad-ti_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#jim-ipad-ti_options_big .ti_hours").css("top", parseInt(jQuery("#jim-ipad-ti_options .ti_hours").css('top'))-92 +"px");
					else jQuery("#jim-ipad-ti_options .ti_hours").css("top", parseInt(jQuery("#jim-ipad-ti_options_big .ti_hours").css('top'))+92 +"px");
				}
				
			}
			else event.preventDefault();
			
		});
	}
	
	function restoreDefaultTIHours(offset) {
		var firstHour = parseInt(jQuery("#jim-ipad-ti_options .ti_hours :first-child").text(), 10),
		newStartHour = firstHour+offset;
		
		resetTIHours(jQuery("#jim-ipad-ti_options .ti_hours").children(), firstHour, newStartHour);
		resetTIHours(jQuery("#jim-ipad-ti_options_big .ti_hours").children(), firstHour, newStartHour);
		
		var topPos = 210, topPosBig = 302;
		jQuery("#jim-ipad-ti_options .ti_hours").css('top', -topPos + 'px');
		jQuery("#jim-ipad-ti_options_big .ti_hours").css('top', -topPosBig + 'px');
	}
	
	function resetTIHours(currentHourList, firstHour, newStartHour) {
		for(var i=0; i<currentHourList.length; i++) {
			var item = jQuery(currentHourList[i]);
			var value = (newStartHour + i + 12)%12;
			if(value===0) value=12;
			var oldValue = (firstHour + i + 12)%12;
			if(oldValue===0) oldValue=12;
			
			item.removeClass("hour" + oldValue);
			item.addClass("hour" + value);
			item.text(value);
		}
	}
	
	/** MINUTES **/
	function bindTimeMinutes() {
		jQuery(controller.timeKey+" .ti_minutes").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var topPos = 210, topPosBig = 302;
				
				var ddTop = parseInt(jQuery("#jim-ipad-ti_options .ti_minutes").css('top'));
				if((ddTop+topPos)>14) {
					var offset = -topPos-ddTop-14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-ti_options_big .ti_minutes").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-ti_options .ti_minutes").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultTIMinutes(despl);
						jQuery("#jim-ipad-ti_options .ti_minutes").css('top', -topPos + 'px');
						jQuery("#jim-ipad-ti_options_big .ti_minutes").css('top', -topPosBig + 'px');
						setTimeValue(input);
					});
				}
				else if((ddTop+topPos)<-14) {
					var offset = -topPos-ddTop+14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-ti_options_big .ti_minutes").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-ti_options .ti_minutes").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultTIMinutes(despl);
						jQuery("#jim-ipad-ti_options .ti_minutes").css('top', -topPos + 'px');
						jQuery("#jim-ipad-ti_options_big .ti_minutes").css('top', -topPosBig + 'px');
						setTimeValue(input);
					});
				}
				else {
					jQuery("#jim-ipad-ti_options_big .ti_minutes").animate({'top' : -topPosBig + 'px', queue : false });
					jQuery("#jim-ipad-ti_options .ti_minutes").animate({'top': -topPos + 'px', queue : false }, function() {
						setTimeValue(input);
					});
				}
			}
		});

		jQuery(controller.timeKey+" .ti_minutes").on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery(controller.timeKey+" .ti_minutes").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-ipad-ti_options .ti_minutes").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-ipad-ti_options .ti_minutes").trigger('mouseup');
				}
				else {
					if(jQuery("#jim-ipad-ti_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#jim-ipad-ti_options_big .ti_minutes").css("top", parseInt(jQuery("#jim-ipad-ti_options .ti_minutes").css('top'))-92 +"px");
					else jQuery("#jim-ipad-ti_options .ti_minutes").css("top", parseInt(jQuery("#jim-ipad-ti_options_big .ti_minutes").css('top'))+92 +"px");
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultTIMinutes(offset) {
		var firstMinute = parseInt(jQuery("#jim-ipad-ti_options .ti_minutes :first-child").text(), 10),
		newStartMinute = firstMinute+offset;
		
		resetTIMinutes(jQuery("#jim-ipad-ti_options .ti_minutes").children(), firstMinute, newStartMinute);
		resetTIMinutes(jQuery("#jim-ipad-ti_options_big .ti_minutes").children(), firstMinute, newStartMinute);

		var topPos = 210, topPosBig = 302;		
		jQuery("#jim-ipad-ti_options .ti_minutes").css('top', -topPos + 'px');
		jQuery("#jim-ipad-ti_options_big .ti_minutes").css('top', -topPosBig + 'px');
	}
	
	function resetTIMinutes(currentMinuteList, firstMinute, newStartMinute) {
		for(var i=0; i<currentMinuteList.length; i++) {
			var item = jQuery(currentMinuteList[i]);
			var value = (newStartMinute + i + 60)%60;
			if(value.toString().length===1) value = "0"+value;
			var oldValue = (firstMinute + i + 60)%60;
			if(oldValue.toString().length===1) oldValue = "0"+oldValue;
			
			item.removeClass("minute" + oldValue);
			item.addClass("minute" + value);
			item.text(value);
		}
	}
	
	/** PERIODS **/
	function bindTimePeriods() {
		jQuery(controller.timeKey+" .ti_periods").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var topPos = 90, topPosBig = -2;
				
				var ddTop = parseInt(jQuery("#jim-ipad-ti_options .ti_periods").css('top'));
				if((topPos-ddTop)>14) {
					jQuery("#jim-ipad-ti_options_big .ti_periods").animate({'top' : topPosBig-30 + 'px', queue : false });
					jQuery("#jim-ipad-ti_options .ti_periods").animate({'top' : topPos-30 + 'px', queue : false }, function() {
						setTimeValue(input);
						jQuery(".ti_periods").removeClass("am pm").addClass("pm");
					});
				}
				else if((topPos-ddTop)<-14) {
					jQuery("#jim-ipad-ti_options_big .ti_periods").animate({'top' : topPosBig + 'px', queue : false });
					jQuery("#jim-ipad-ti_options .ti_periods").animate({'top' : topPos + 'px', queue : false}, function() {
						setTimeValue(input);
						jQuery(".ti_periods").removeClass("am pm").addClass("am");
					});
				}
				else {
					jQuery("#jim-ipad-ti_options_big .ti_periods").animate({'top' : topPosBig + 'px', queue : false });
					jQuery("#jim-ipad-ti_options .ti_periods").animate({'top': topPos + 'px', queue : false}, function() {
						setTimeValue(input);
						jQuery(".ti_periods").removeClass("am pm").addClass("am");
					});
				}
			}
		});

		jQuery(controller.timeKey+" .ti_periods").on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery(controller.timeKey+" .ti_periods").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-ipad-ti_options .ti_periods").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-ipad-ti_options .ti_periods").trigger('mouseup');
				}
				else {
					if(jQuery("#jim-ipad-ti_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#jim-ipad-ti_options_big .ti_periods").css("top", parseInt(jQuery("#jim-ipad-ti_options .ti_periods").css('top'))-92 +"px");
					else jQuery("#jim-ipad-ti_options .ti_periods").css("top", parseInt(jQuery("#jim-ipad-ti_options_big .ti_periods").css('top'))+92 +"px");
				}
			}
			else event.preventDefault();
			
		});
	}
	
	function fillTime() {
		var currentHour, currentMinute, currentPeriod, html = "";
		var currentValue = input.find("input").val();
		if(currentValue==="") {
			var currentDate = new Date();
			currentHour = currentDate.getHours();
			currentMinutes = currentDate.getMinutes();
			currentPeriod = (currentHour<12) ? periods[0] : periods[1];
		}
		else {
			currentHour = parseInt(currentValue.substring(0, currentValue.indexOf(":")), 10);
			currentMinutes = parseInt(currentValue.substring(currentValue.indexOf(":")+1), 10);
			currentPeriod = (currentHour<12) ? periods[0] : periods[1];
		}

		//hours
		var html = "";
		for(var i=currentHour-10;i<=currentHour+10;i++) {
			var val = i;
			val = (val+12)%12;
			if(val===0) val=12;
			html += "<div class='hours hour" + val + "'>" + val + "</div>"; 
		}
		jQuery(".ti_hours").html(html);
		
		//minutes
		html = "";
		for(var i=currentMinutes-10;i<=currentMinutes+10;i++) {
			var val = i;
			val = (val+60)%60;
			if(val===0) val=0;
			if(val.toString().length===1) val = "0"+val;
			html += "<div class='minutes minute" + val + "'>" + val + "</div>";
		}
		jQuery(".ti_minutes").html(html);
		
		//period
		html = "";
		$.each(periods, function(key, index) {
			html += "<div class='periods'>" + this + "</div>";
		});
		jQuery(".ti_periods").html(html);
		
		setTimeout(function() {
			if(currentPeriod===periods[1]) {
				var topPos = 60, topPosBig = -32;		
				jQuery("#jim-ipad-ti_options .ti_periods").css("top", topPos + "px");
				jQuery("#jim-ipad-ti_options_big .ti_periods").css("top", topPosBig + "px");
				jQuery(".ti_periods").removeClass("am pm").addClass("pm");
			}
			else jQuery(".ti_periods").removeClass("am pm").addClass("am");
			setTimeValue();
		}, 100);
	}
	
	function setTimeValue() {
		var hour = parseInt(jQuery("#jim-ipad-ti_options .ti_hours :nth-child(11)").text(), 10),
		minute = parseInt(jQuery("#jim-ipad-ti_options .ti_minutes :nth-child(11)").text(), 10),
		period = (parseInt(jQuery("#jim-ipad-ti_options .ti_periods").css("top"))>=62) ? periods[0] : periods[1];
		hour = (period===periods[0] && hour===12) ? 0 : hour;
		hour = (period===periods[1] && hour<12) ? hour+12 : hour;
		if(minute.toString().length===1) minute = "0" + minute;
				
		value = hour + ":" + minute; 
		input.find("input").val(jimUtil.fromHTML(value));
		if(initialInputValue!==value) {
			input.closest(".firer").trigger("change");
			initialInputValue = value;
		}
	}
	
	function clearTimeValue() {
		input.find("input").val(jimUtil.fromHTML(""));
		if(initialInputValue!=="") {
			input.closest(".firer").trigger("change");
			initialInputValue = "";
		}
	}

	/*********************** END TIME METHODS ************************/
	
	/*********************** START DATETIME METHODS ************************/
	
	function createDateTime() {
		var html = "";
		if($.browser.msie)
			html = '<div id='+controller.datetimeKey.substring(1)+'><div id="jim-ipad-dt_controls"><div class="dt_controls-clear">Clear</div></div><div><div class="jim-ipad-dt_mask"></div><div id="jim-ipad-dt_options"><div class="dt_date"><div class="dt_weekday"></div><div class="dt_day"></div><div class="dt_year"></div></div><div class="dt_hours"></div><div class="dt_minutes"></div><div class="dt_periods"></div></div><div id="jim-ipad-dt_options_big"><div class="dt_date"><div class="dt_weekday"></div><div class="dt_day"></div><div class="dt_year"></div></div><div class="dt_hours"></div><div class="dt_minutes"></div><div class="dt_periods"></div></div></div></div>';
		else html = '<div id='+controller.datetimeKey.substring(1)+'><div id="jim-ipad-dt_controls"><div class="dt_controls-clear">Clear</div></div><div><div id="jim-ipad-dt_options"><div class="dt_date"><div class="dt_weekday"></div><div class="dt_day"></div><div class="dt_year"></div></div><div class="dt_hours"></div><div class="dt_minutes"></div><div class="dt_periods"></div></div><div id="jim-ipad-dt_options_big"><div class="dt_date"><div class="dt_weekday"></div><div class="dt_day"></div><div class="dt_year"></div></div><div class="dt_hours"></div><div class="dt_minutes"></div><div class="dt_periods"></div></div><div class="jim-ipad-dt_mask"></div></div></div>';
		jQuery("#jim-container").append(html);
		
		jQuery(controller.datetimeKey+' .dt_date').draggable({
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery(controller.datetimeKey+' .dt_hours').draggable({
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery(controller.datetimeKey+' .dt_minutes').draggable({
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery(controller.datetimeKey+' .dt_periods').draggable({ axis: "y" });
	}
	
	function bindDateTime() {
		bindDateTimeDate();
		bindDateTimeHours();
		bindDateTimeMinutes();
		bindDateTimePeriods();
	}
	
	/** CONTROLS **/
	function bindDateTimeControls() {
		jQuery(controller.datetimeKey).on("mouseup", function(event, data) {
			if (event.target.tagName === "DIV" && !dragStart) {
				var key = event.target.className;
				if(key) {
					if(key.indexOf(" ")>0)
						key=key.substring(0, key.indexOf(" "));
					switch(key) {
						case "dt_controls-clear":
							jQuery("#jim-ipad-dt_controls .dt_controls-clear").removeClass("pressed");
							clearDateTimeValue(input);
							break;
						default:
							break;
					}
				}
			}
		});
		
		jQuery(controller.datetimeKey).on("mousedown", function(event, data) {
			if (event.target.tagName === "DIV" && !dragStart) {
				var key = event.target.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				switch(key) {
					case "dt_controls-clear":
						jQuery(event.target).removeClass("pressed").addClass("pressed");
						break;
					default:
						break;
				}
				event.preventDefault();
			}
		});
	}
	
	/** DATE **/
	function bindDateTimeDate() {
		jQuery(controller.datetimeKey+" .dt_date").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var topPos = 210, topPosBig = 302;
				
				var ddTop = parseInt(jQuery("#jim-ipad-dt_options .dt_date").css('top'));
				if((ddTop+topPos)>14) {
					var offset = -topPos-ddTop-14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-dt_options_big .dt_date").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-dt_options .dt_date").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDTDate(despl);
						jQuery("#jim-ipad-dt_options .dt_date").css('top', -topPos + 'px');
						jQuery("#jim-ipad-dt_options_big .dt_date").css('top', -topPosBig + 'px');
						setDateTimeValue(input);
					});
				}
				else if((ddTop+topPos)<-14) {
					var offset = -topPos-ddTop+14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-dt_options_big .dt_date").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-dt_options .dt_date").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDTDate(despl);
						jQuery("#jim-ipad-dt_options .dt_date").css('top', -topPos + 'px');
						jQuery("#jim-ipad-dt_options_big .dt_date").css('top', -topPosBig + 'px');
						setDateTimeValue(input);
					});
				}
				else {
					jQuery("#jim-ipad-dt_options_big .dt_date").animate({'top' : -topPosBig + 'px', queue : false });
					jQuery("#jim-ipad-dt_options .dt_date").animate({'top': -topPos + 'px', queue : false }, function() {
						setDateTimeValue(input);
					});
				}
			}
		});
		
		jQuery(controller.datetimeKey+" .dt_date").on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery(controller.datetimeKey+" .dt_date").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-ipad-dt_options .dt_date").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-ipad-dt_options .dt_date").trigger('mouseup');
				}
				else {
					if(jQuery("#jim-ipad-dt_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#jim-ipad-dt_options_big .dt_date").css("top", parseInt(jQuery("#jim-ipad-dt_options .dt_date").css('top'))-92 +"px");
					else jQuery("#jim-ipad-dt_options .dt_date").css("top", parseInt(jQuery("#jim-ipad-dt_options_big .dt_date").css('top'))+92 +"px");
				}
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultDTDate(offset) {
		var firstDay = parseInt(jQuery("#jim-ipad-dt_options .dt_date .date.day:first-child").text().substring(4), 10),
		newStartDay = firstDay+offset,
		dayArray = getFullDayOffsetArray(offset),
		currentDate = new Date();
		
		resetDTDate(jQuery("#jim-ipad-dt_options .dt_date .dt_weekday").children(), jQuery("#jim-ipad-dt_options .dt_date .dt_day").children(), jQuery("#jim-ipad-dt_options .dt_date .dt_year").children(), firstDay, newStartDay, dayArray, currentDate);
		resetDTDate(jQuery("#jim-ipad-dt_options_big .dt_date .dt_weekday").children(), jQuery("#jim-ipad-dt_options_big .dt_date .dt_day").children(), jQuery("#jim-ipad-dt_options_big .dt_date .dt_year").children(), firstDay, newStartDay, dayArray, currentDate);
		
		var topPos = 210, topPosBig = 302;		
		jQuery("#jim-ipad-dt_options .dt_days").css('top', -topPos + 'px');
		jQuery("#jim-ipad-dt_options_big .dt_days").css('top', -topPosBig + 'px');
	}
	
	function resetDTDate(currentWeekdayList, currentDayList, currentYearList, firstDay, newStartDay, dayArray, currentDate) {
		//weekday
		for(var i=0; i<currentWeekdayList.length; i++) {
			var item = jQuery(currentWeekdayList[i]);
			var value = dayArray[i];
			if(value.weekday===currentDate.getDay() && value.month===currentDate.getMonth() && value.day===currentDate.getDate() && value.year===currentDate.getFullYear()) {
				item.removeClass("weekday").text("");
			}
			else {
				item.removeClass("weekday").addClass("weekday").text(daysCompressed[value.weekday-1]);
			}
		}
		
		//day
		for(var i=0; i<currentDayList.length; i++) {
			var item = jQuery(currentDayList[i]);
			var value = dayArray[i];
			if(value.weekday===currentDate.getDay() && value.month===currentDate.getMonth() && value.day===currentDate.getDate() && value.year===currentDate.getFullYear()) {
				item.removeClass("weekday, day").addClass("today").text("Today");
			}
			else {
				item.removeClass("day, today").addClass("day").text(monthsCompressed[value.month] + " " + value.day);
			}
		}
		
		//year
		for(var i=0; i<currentYearList.length; i++) {
			var item = jQuery(currentYearList[i]);
			var value = dayArray[i];
			item.text(value.year);
		}
	}
	
	/** HOURS **/
	function bindDateTimeHours() {
		jQuery(controller.datetimeKey+" .dt_hours").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var topPos = 210, topPosBig = 302;
								
				var ddTop = parseInt(jQuery("#jim-ipad-dt_options .dt_hours").css('top'));
				if((ddTop+topPos)>14) {
					var offset = -topPos-ddTop-14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-dt_options_big .dt_hours").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-dt_options .dt_hours").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDTHours(despl);
						jQuery("#jim-ipad-dt_options .dt_hours").css('top', -topPos + 'px');
						jQuery("#jim-ipad-dt_options_big .dt_hours").css('top', -topPosBig + 'px');
						setDateTimeValue(input);
					});
				}
				else if((ddTop+topPos)<-14) {
					var offset = -topPos-ddTop+14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-dt_options_big .dt_hours").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-dt_options .dt_hours").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDTHours(despl);
						jQuery("#jim-ipad-dt_options .dt_hours").css('top', -topPos + 'px');
						jQuery("#jim-ipad-dt_options_big .dt_hours").css('top', -topPosBig + 'px');
						setDateTimeValue(input);
					});
				}
				else {
					jQuery("#jim-ipad-dt_options_big .dt_hours").animate({'top' : -topPosBig + 'px', queue : false });
					jQuery("#jim-ipad-dt_options .dt_hours").animate({'top': -topPos + 'px', queue : false }, function() {
						setDateTimeValue(input);
					});
				}
			}
		});

		jQuery(controller.datetimeKey+" .dt_hours").on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery(controller.datetimeKey+" .dt_hours").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-ipad-dt_options .dt_hours").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-ipad-dt_options .dt_hours").trigger('mouseup');
				}
				else {
					if(jQuery("#jim-ipad-dt_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#jim-ipad-dt_options_big .dt_hours").css("top", parseInt(jQuery("#jim-ipad-dt_options .dt_hours").css('top'))-92 +"px");
					else jQuery("#jim-ipad-dt_options .dt_hours").css("top", parseInt(jQuery("#jim-ipad-dt_options_big .dt_hours").css('top'))+92 +"px");
				}
			}
			else event.preventDefault();
			
		});
	}
	
	function restoreDefaultDTHours(offset) {
		var firstHour = parseInt(jQuery("#jim-ipad-dt_options .dt_hours :first-child").text(), 10),
		newStartHour = firstHour+offset;
		
		resetDTHours(jQuery("#jim-ipad-dt_options .dt_hours").children(), firstHour, newStartHour);
		resetDTHours(jQuery("#jim-ipad-dt_options_big .dt_hours").children(), firstHour, newStartHour);
		
		var topPos = 210, topPosBig = 302;
		jQuery("#jim-ipad-dt_options .dt_hours").css('top', -topPos + 'px');
		jQuery("#jim-ipad-dt_options_big .dt_hours").css('top', -topPosBig + 'px');
	}
	
	function resetDTHours(currentHourList, firstHour, newStartHour) {
		for(var i=0; i<currentHourList.length; i++) {
			var item = jQuery(currentHourList[i]);
			var value = (newStartHour + i + 12)%12;
			if(value===0) value=12;
			var oldValue = (firstHour + i + 12)%12;
			if(oldValue===0) oldValue=12;
			
			item.removeClass("hour" + oldValue);
			item.addClass("hour" + value);
			item.text(value);
		}
	} 
	
	/** MINUTES **/
	function bindDateTimeMinutes() {
		jQuery(controller.datetimeKey+" .dt_minutes").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var topPos = 210, topPosBig = 302;
				
				var ddTop = parseInt(jQuery("#jim-ipad-dt_options .dt_minutes").css('top'));
				if((ddTop+topPos)>14) {
					var offset = -topPos-ddTop-14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-dt_options_big .dt_minutes").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-dt_options .dt_minutes").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDTMinutes(despl);
						jQuery("#jim-ipad-dt_options .dt_minutes").css('top', -topPos + 'px');
						jQuery("#jim-ipad-dt_options_big .dt_minutes").css('top', -topPosBig + 'px');
						setDateTimeValue(input);
					});
				}
				else if((ddTop+topPos)<-14) {
					var offset = -topPos-ddTop+14;
					var despl = parseInt(offset/29);
					jQuery("#jim-ipad-dt_options_big .dt_minutes").animate({'top' : -topPosBig-(despl*29) + 'px', queue : false });
					jQuery("#jim-ipad-dt_options .dt_minutes").animate({'top' : -topPos-(despl*29) + 'px', queue : false }, function() {
						restoreDefaultDTMinutes(despl);
						jQuery("#jim-ipad-dt_options .dt_minutes").css('top', -topPos + 'px');
						jQuery("#jim-ipad-dt_options_big .dt_minutes").css('top', -topPosBig + 'px');
						setDateTimeValue(input);
					});
				}
				else {
					jQuery("#jim-ipad-dt_options_big .dt_minutes").animate({'top': -topPosBig + 'px', queue : false });
					jQuery("#jim-ipad-dt_options .dt_minutes").animate({'top': -topPos + 'px', queue : false }, function() {
						setDateTimeValue(input);
					});
				}
			}
		});

		jQuery(controller.datetimeKey+" .dt_minutes").on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery(controller.datetimeKey+" .dt_minutes").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-ipad-dt_options .dt_minutes").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-ipad-dt_options .dt_minutes").trigger('mouseup');
				}
				else {
					if(jQuery("#jim-ipad-dt_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#jim-ipad-dt_options_big .dt_minutes").css("top", parseInt(jQuery("#jim-ipad-dt_options .dt_minutes").css('top'))-92 +"px");
					else jQuery("#jim-ipad-dt_options .dt_minutes").css("top", parseInt(jQuery("#jim-ipad-dt_options_big .dt_minutes").css('top'))+92 +"px");
				}
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultDTMinutes(offset) {
		var firstMinute = parseInt(jQuery("#jim-ipad-dt_options .dt_minutes :first-child").text(), 10),
		newStartMinute = firstMinute+offset;

		resetDTMinutes(jQuery("#jim-ipad-dt_options .dt_minutes").children(), firstMinute, newStartMinute);
		resetDTMinutes(jQuery("#jim-ipad-dt_options_big .dt_minutes").children(), firstMinute, newStartMinute);

		var topPos = 210, topPosBig = 302;		
		jQuery("#jim-ipad-dt_options .dt_minutes").css('top', -topPos + 'px');
		jQuery("#jim-ipad-dt_options_big .dt_minutes").css('top', -topPosBig + 'px');
	}
	
	function resetDTMinutes(currentMinuteList, firstMinute, newStartMinute) {
		for(var i=0; i<currentMinuteList.length; i++) {
			var item = jQuery(currentMinuteList[i]);
			var value = (newStartMinute + i + 60)%60;
			if(value.toString().length===1) value = "0"+value;
			var oldValue = (firstMinute + i + 60)%60;
			if(oldValue.toString().length===1) oldValue = "0"+oldValue;
			
			item.removeClass("minute" + oldValue);
			item.addClass("minute" + value);
			item.text(value);
		}
	}
	
	
	/** PERIODS **/
	function bindDateTimePeriods() {
		jQuery(controller.datetimeKey+" .dt_periods").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var topPos = 90, topPosBig = -2;
				
				var ddTop = parseInt(jQuery("#jim-ipad-dt_options .dt_periods").css('top'));
				if((topPos-ddTop)>14) {
					jQuery("#jim-ipad-dt_options_big .dt_periods").animate({'top' : topPosBig-30 + 'px', queue: false });
					jQuery("#jim-ipad-dt_options .dt_periods").animate({'top' : topPos-30 + 'px', queue: false }, function() {
						setDateTimeValue(input);
						jQuery(".dt_periods").removeClass("am pm").addClass("pm");
					});
				}
				else if((topPos-ddTop)<-14) {
					jQuery("#jim-ipad-dt_options_big .dt_periods").animate({'top' : topPosBig + 'px', queue: false });
					jQuery("#jim-ipad-dt_options .dt_periods").animate({'top' : topPos + 'px', queue: false }, function() {
						setDateTimeValue(input);
						jQuery(".dt_periods").removeClass("am pm").addClass("am");
					});
				}
				else {
					jQuery("#jim-ipad-dt_options_big .dt_periods").animate({'top' : topPosBig + 'px', queue: false });
					jQuery("#jim-ipad-dt_options .dt_periods").animate({'top': topPos + 'px', queue: false }, function() {
						setDateTimeValue(input);
						jQuery(".dt_periods").removeClass("am pm").addClass("am");				
					});
				}
			}
		});

		jQuery(controller.datetimeKey+" .dt_periods").on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery(controller.datetimeKey+" .dt_periods").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-ipad-dt_options .dt_periods").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-ipad-dt_options .dt_periods").trigger('mouseup');
				}
				else {
					if(jQuery("#jim-ipad-dt_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#jim-ipad-dt_options_big .dt_periods").css("top", parseInt(jQuery("#jim-ipad-dt_options .dt_periods").css('top'))-92 +"px");
					else jQuery("#jim-ipad-dt_options .dt_periods").css("top", parseInt(jQuery("#jim-ipad-dt_options_big .dt_periods").css('top'))+92 +"px");
				}
			}
			else event.preventDefault();
			
		});
	}
	
	function fillDateTime() {
		var htmlWeek = "", htmlDay = "", htmlYear = "", html = "",
		currentHour, currentMinute, currentPeriod,
		currentValue = input.find("input").val();
		
		var currentDate = new Date();
		if(currentValue==="") {
			currentMonth = currentDate.getMonth();
			currentWeekday = currentDate.getDay();
			currentDay = currentDate.getDate();
			currentYear = currentDate.getFullYear()
			currentHour = currentDate.getHours();
			currentMinutes = currentDate.getMinutes();
			currentPeriod = (currentHour<12) ? periods[0] : periods[1];
		}
		else {
			currentMonth = parseInt(currentValue.substring(0, currentValue.indexOf("/")), 10)-1;
			currentDay = parseInt(currentValue.substring(currentValue.indexOf("/")+1, currentValue.lastIndexOf("/")), 10);
			currentYear = parseInt(currentValue.substring(currentValue.lastIndexOf("/")+1, currentValue.indexOf(" ")), 10);
			currentHour = parseInt(currentValue.substring(currentValue.indexOf(" "), currentValue.indexOf(":")), 10);
			currentMinutes = parseInt(currentValue.substring(currentValue.indexOf(":")+1), 10);
			currentPeriod = (currentHour<12) ? periods[0] : periods[1];
			currentWeekday = parseInt(new Date(currentYear, currentMonth, currentDay).getDay(), 10);

			currentHour = (currentHour+12)%12;
			if(currentHour===0) currentHour=12;
		}
		
		//date
		var dayArray = getFullDayArray(currentDay, currentMonth, currentWeekday, currentYear);
		for(var i=0;i<dayArray.length;i++) {
			var value = dayArray[i];
			if(value.weekday===currentDate.getDay() && value.month===currentDate.getMonth() && value.day===currentDate.getDate() && value.year===currentDate.getFullYear()) {
				htmlWeek += "<div class='date'></div>";
				htmlDay += "<div class='date today'>Today</div>";
				htmlYear += "<div class='date year'>" + value.year + "</div>";
			}
			else {
				htmlWeek += "<div class='date weekday'>" + daysCompressed[value.weekday-1] + "</div>";
				htmlDay += ("<div class='date day'>" + monthsCompressed[value.month] + " " + value.day + "</div>");
				htmlYear += "<div class='date year'>" + value.year + "</div>";
			}
		}
		jQuery(".dt_weekday").html(htmlWeek);
		jQuery(".dt_day").html(htmlDay);
		jQuery(".dt_year").html(htmlYear);
		
		//hours
		var html = "";
		for(var i=currentHour-10;i<=currentHour+10;i++) {
			var val = i;
			val = (val+12)%12;
			if(val===0) val=12;
			html += "<div class='hours hour" + val + "'>" + val + "</div>"; 
		}
		jQuery(".dt_hours").html(html);
		
		//minutes
		html = "";
		for(var i=currentMinutes-10;i<=currentMinutes+10;i++) {
			var val = i;
			val = (val+60)%60;
			if(val===0) val=0;
			if(val.toString().length===1) val = "0"+val;
			html += "<div class='minutes minute" + val + "'>" + val + "</div>";
		}
		jQuery(".dt_minutes").html(html);
		
		//period
		html = "";
		$.each(periods, function(key, index) {
			html += "<div class='periods'>" + this + "</div>";
		});
		
		jQuery(".dt_periods").html(html);
		setTimeout(function() {
			if(currentPeriod===periods[1]) {
				var topPos = 60, topPosBig = -32;
				jQuery("#jim-ipad-dt_options .dt_periods").css("top", topPos + "px");
				jQuery("#jim-ipad-dt_options_big .dt_periods").css("top", topPosBig + "px");
				jQuery(".dt_periods").removeClass("am pm").addClass("pm");
			}
			else jQuery(".dt_periods").removeClass("am pm").addClass("am");
			setDateTimeValue(input);
		}, 100);
	}
	
	function getFullDayArray(currentDay, currentMonth, currentWeekday, currentYear) {
		var calculatedDay = parseInt(currentDay, 10),
		calculatedMonth = parseInt(currentMonth, 10),
		calculatedWeekday = parseInt(currentWeekday, 10),
		calculatedYear = parseInt(currentYear, 10),
		fullDayArray = new Array(21); 
		
		//Before
		for(var i=0;i>=-9;i--) {
			calculatedDay = (calculatedDay-(1)+31)%31;
			if(calculatedDay===0) calculatedDay=31;
			
			//month before!
			if(calculatedDay<=31 && currentDay>=1 && currentDay<calculatedDay) {
				calculatedMonth = (currentMonth-(1)+12)%12;
				if(calculatedMonth===11 && currentMonth===0)
					calculatedYear = currentYear-1;
			}
			if(calculatedDay===31 && ((calculatedMonth<6 && calculatedMonth%2===1) || (calculatedMonth>=6 && calculatedMonth%2===0))) {
				calculatedDay=30;
			}
			if(calculatedDay >=30 && calculatedMonth===1) {
				calculatedDay=29;
			}
			if(calculatedDay >=29 && calculatedYear%4!==0 && calculatedMonth===1) {
				calculatedDay=28;
			}
			
			calculatedWeekday = (calculatedWeekday-(1)+7)%7;
			if(calculatedWeekday===0) calculatedWeekday=7;
			
			fullDayArray[i+9] = { "weekday": calculatedWeekday, "day": calculatedDay, "month": calculatedMonth, "year": calculatedYear };
		}
		
		//Today
		if(currentWeekday===0) currentWeekday=7;
		fullDayArray[10] = { "weekday": currentWeekday, "day": currentDay, "month": currentMonth, "year": currentYear };
		
		calculatedDay = currentDay;
		calculatedMonth = currentMonth;
		calculatedWeekday = currentWeekday;
		calculatedYear = currentYear;
		
		//After
		for(var i=1;i<11;i++) {
			calculatedDay = (calculatedDay+(1)+31)%31;
			if(calculatedDay===0) calculatedDay=31;
			
			if(calculatedDay===31 && ((calculatedMonth<6 && calculatedMonth%2===1) || (calculatedMonth>=6 && calculatedMonth%2===0))) {
				calculatedDay=1;
			}
			if(calculatedDay >=30 && calculatedMonth===1) {
				calculatedDay=1;
			}
			if(calculatedDay >=29 && calculatedYear%4!==0 && calculatedMonth===1) {
				calculatedDay=1;
			}
			
			//month after!
			if(calculatedDay>=1 && currentDay<=31 && currentDay>calculatedDay) {
				calculatedMonth = (currentMonth+(1)+12)%12;
				if(calculatedMonth===0)
					calculatedYear = currentYear+1;
			}
			
			calculatedWeekday = (calculatedWeekday+(1))%7;
			if(calculatedWeekday===0) calculatedWeekday=7;
			
			fullDayArray[i+10] = { "weekday": calculatedWeekday, "day": calculatedDay, "month": calculatedMonth, "year": calculatedYear };
		}

		return fullDayArray;
	}

	function getFullDayOffsetArray(offset) {
		var dayTxt = jQuery("#jim-ipad-dt_options .dt_date .date.day:nth-child(" + (11+offset) + ")").text();
		var weekdayTxt = jQuery("#jim-ipad-dt_options .dt_date .date.weekday:nth-child(" + (11+offset) + ")").text();
		var yearTxt = jQuery("#jim-ipad-dt_options .dt_date .date.year:nth-child(" + (11+offset) + ")").text();

		var month="";
		var day="";
		var year="";
		if(weekdayTxt==="") {
			month = monthsCompressed[currentMonth];
			day = currentDay;
			weekdayTxt = daysCompressed[currentWeekday-1];
			year=currentYear;
		}
		else {
			month = dayTxt.substring(0,3);
			day = dayTxt.substring(4);
			year=parseInt(yearTxt);
		}
		
		var calculatedDay = parseInt(day, 10);
		var calculatedMonth = jQuery.inArray(month, monthsCompressed);
		var calculatedWeekday = jQuery.inArray(weekdayTxt, daysCompressed)+1;
		var calculatedYear = year;

		return getFullDayArray(calculatedDay, calculatedMonth, calculatedWeekday, calculatedYear);
	}
	
	function setDateTimeValue() {
		var month, day,
		year = parseInt(jQuery("#jim-ipad-dt_options .dt_year :nth-child(11)").text()),
		hour = parseInt(jQuery("#jim-ipad-dt_options .dt_hours :nth-child(11)").text(), 10),
		minute = parseInt(jQuery("#jim-ipad-dt_options .dt_minutes :nth-child(11)").text(), 10),
		period = (parseInt(jQuery("#jim-ipad-dt_options .dt_periods").css("top"))>=62) ? periods[0] : periods[1],
		hour = (period===periods[0] && hour===12) ? 0 : hour;
		hour = (period===periods[1] && hour<12) ? hour+12 : hour;
		if(minute.toString().length===1) minute = "0" + minute;
				
		var date = jQuery("#jim-ipad-dt_options .dt_day :nth-child(11)").text();
		if(date==="Today") {
			month = currentMonth+1;
			day = currentDay;
		}
		else {
			month = jQuery.inArray(date.substring(0, 3), monthsCompressed)+1;
			day = parseInt(date.substring(4));
		}
		if(month.toString().length===1) month = "0" + month;
		if(day.toString().length===1) day = "0" + day;
		
		value = month + "/" + day + "/" + year + " " + hour + ":" + minute; 
		input.find("input").val(jimUtil.fromHTML(value));
		if(initialInputValue!==value) {
			input.closest(".firer").trigger("change");
			initialInputValue = value;
		}
	}
	
	function clearDateTimeValue() {
		input.find("input").val(jimUtil.fromHTML(""));
		if(initialInputValue!=="") {
			input.closest(".firer").trigger("change");
			initialInputValue = "";
		}
	}
	
	/*********************** END DATETIME METHODS ************************/
	
	/*********************** START MASK METHODS ************************/
	
	function addMask() {
		var html = "<div id='jim-ipad-mask'></div>";
		jQuery("#jim-container").append(html);
		
	}
	
	function removeMask() {
		var html = "<div id='jim-ipad-mask'></div>";
		jQuery("#jim-container").remove('#jim-ipad-mask');
	}
	
	/*********************** END MASK METHODS ************************/
	
	
	/*********************** START OTHER METHODS ************************/
	
	 function slideKeyboard(k, show) {
		  	var w = parseInt(k.css("width"));
			var h = parseInt(k.css("height"));
			var t = parseInt(k.css("top"));
			var l = parseInt(k.css("left"));

			var wrapper = $('<div />', {"class": 'keyWrapper'});
			wrapper.css({"position":"absolute","overflow":"hidden","width":w,"height":h,"top":t,"left":l});
			k.css({"top": (show)?h:"0px","left":"0px","display":"block"});
			k.wrap(wrapper);

			k.animate({"top":(show)?"0px":h}, 300, function () {
				k.unwrap();
				k.css({"top":"","left":""});
				if (!show) k.css({"display": ""});
			});
	}
	
	function checkExternalClick(event) {
		var $target = $(event.target);
		if(input && ( (($target.closest(".text")[0]!==input[0]) && ($target.closest(".text").length===0 && $target.closest(".password").length===0 && $target.closest(".textarea").length===0)) || 
				(($target.closest(".password")[0]!==input[0]) && ($target.closest(".text").length===0 && $target.closest(".password").length===0 && $target.closest(".textarea").length===0)) || 
				(($target.closest(".textarea")[0]!==input[0]) && ($target.closest(".text").length===0 && $target.closest(".password").length===0 && $target.closest(".textarea").length===0)) )
				&& $target[0].id != $(controller.keyboardKey) && !$target.closest(controller.keyboardKey).length && $(controller.keyboardKey).css("display")!=="none" && !$(controller.keyboardKey+":animated").length) {
			slideKeyboard(jQuery(controller.keyboardKey), false);
			jQuery("#jim-ipad-mask").hide();
			deactivateSpecialKeys();
			
			var value = "";
			if(input.find("input").length>0)
				value = input.find("input").val();
			else if(input.find("textarea").length>0)
				value = input.find("textarea").val();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
			input.find("input:focus").blur();
			input.find("textarea:focus").blur();
		}
		if(input && ($target.closest(".dropdown, .nativedropdown")[0]!==input[0]) && !$target.is(".dropdown, .nativedropdown") && $target[0].id != $(controller.dropdownKey) && !$target.closest(controller.dropdownKey).length && $(controller.dropdownKey).css("display")!=="none") {
			jQuery(controller.dropdownKey).fadeOut(300);
			jQuery("#jim-ipad-mask").hide();
			jQuery(".dropdown, .nativedropdown").removeClass("pressed");
			var value = input.children(".valign").children(".value").text();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
		}
		if(input && ($target.closest(".date")[0]!==input[0]) && $target.closest(".date").length===0 && $target[0].id != $(controller.dateKey) && !$target.closest(controller.dateKey).length && $(controller.dateKey).css("display")!=="none") {
			jQuery(controller.dateKey).fadeOut(300);
			jQuery("#jim-ipad-mask").hide();
			var value = input.find("input").val();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
			input.find("input:focus").blur();
		}
		if(input && ($target.closest(".time")[0]!==input[0]) && $target.closest(".time").length===0 && $target[0].id != $(controller.timeKey) && !$target.closest(controller.timeKey).length && $(controller.timeKey).css("display")!=="none") {
			jQuery(controller.timeKey).fadeOut(300);
			jQuery("#jim-ipad-mask").hide();
			var value = input.find("input").val();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
			input.find("input:focus").blur();
		}
		if(input && ($target.closest(".datetime")[0]!==input[0]) && $target.closest(".datetime").length===0 && $target[0].id != $(controller.datetimeKey) && !$target.closest(controller.datetimeKey).length && $(controller.datetimeKey).css("display")!=="none") {
			jQuery(controller.datetimeKey).fadeOut(300);
			jQuery("#jim-ipad-mask").hide();
			var value = input.find("input").val();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
			input.find("input:focus").blur();
		}
		
		dragStart=false;
	}
	
	function checkExternalTap(event) {
		var $target = $(event.target);
		if($target.closest(".dropdown, .nativedropdown")[0]===undefined || !$target.is(".dropdown, .nativedropdown")) {
		  jQuery(".dropdown, .nativedropdown").removeClass("pressed");
		  event.stopPropagation();
		}
		dragStart=false;
	}
	
	function correctDragDateWithZoom(evt, ui) {
        // zoom fix
    	var zoom = jimDevice.getZoom();
    	ui.position.top = -214 + (ui.position.top+214) * zoom;
    }
	
	function isComponentAssociatedinDataGrid(newInput) {
		hasDatagridParent = newInput.parents(".datagrid"),
		isOAAssociated = newInput.find("input[name]"),
		OAName = isOAAssociated ? (isOAAssociated.attr("name")!="") ? isOAAssociated.attr("name") : undefined : undefined;
		if(hasDatagridParent && OAName)
			return true;
		else return false;
	}
	
	/*********************** END OTHER METHODS ************************/
	
	
	/*********************** START STATIC ACCESS METHODS ************************/
	
	function bindClickEvents(){
		$("#jim-container").on("mousedown",checkExternalClick);
		if(window.jimDevice.isMobile() && window.jimUtil.isMobileDevice()) {
			$("#simulation").on("mousedown",checkExternalTap);
		}
	}
	
	function unbindClickEvents(){
		$("#jim-container").off("mousedown",checkExternalClick);
		if(window.jimDevice.isMobile() && window.jimUtil.isMobileDevice()) {
			$("#simulation").off("mousedown",checkExternalTap);
		}
	}
	
	var controller = {
		"keyboardKey":"#jim-ios8-pad-kb",
		"dropdownKey":"#jim-ios8-pad-dd",
		"dateKey":"#jim-ios8-pad-da",
		"timeKey":"#jim-ios8-pad-ti",
		"datetimeKey":"#jim-ios8-pad-dt",
		"loadSimulator": function() {
			addMask();
			this.loadKeyboard();
			this.loadDropDown();
			this.loadDate();
			this.loadTime();
			this.loadDateTime();
			bindClickEvents();
		},
		"bindContainer" : function () {
			if (!window.jimUtil.isMobileDevice()) 
			  $("#jim-container").mousedown(checkExternalClick);
		},
		"unloadSimulator": function() {
			removeMask();
			this.unloadKeyboard();
			this.unloadDropDown();
			this.unloadDate();
			this.unloadTime();
			this.unloadDateTime();
			unbindClickEvents();
		},
		"loadKeyboard": function() {
			createKeyboard();
			bindKeyboard();
			var controller = this;

			jQuery("#simulation").delegate(".text:not(.number, .email, .inputurl) input:not([readonly]), .password input:not([readonly]), textarea:not([readonly])", "click, focusin", function(event, data) {
				if(!jQuery(controller.keyboardKey).css("display") || jQuery(controller.keyboardKey).css("display") === "none") {
					jQuery("#jim-ipad-mask").hide();
					slideKeyboard(jQuery(controller.keyboardKey), true);
				}
				lastKeyboard = "#letters";
				var newInput = jQuery(this).closest(".text");
				initialInputValue = newInput.find("input").val();
				if(newInput.length===0) {
					newInput = jQuery(this).closest(".password");
					initialInputValue = newInput.find("input").val(); 
				}
				if(newInput.length===0) {
					newInput = jQuery(this).closest(".textarea");
					initialInputValue = newInput.val();
				}
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
					controller.resetWidgets();
					setStartCaretPosition(input);
					//input.closest(".firer").trigger("focusin");
				}
			});
			
			jQuery("#simulation").delegate(".number input:not([readonly])", "click, focusin", function(event, data) {
				if(!jQuery(controller.keyboardKey).css("display") || jQuery(controller.keyboardKey).css("display") === "none") {
					jQuery("#jim-ipad-mask").hide();
					slideKeyboard(jQuery(controller.keyboardKey), true);
				}
				lastKeyboard = "#letters";
				var newInput = jQuery(this).closest(".number");
				initialInputValue = newInput.find("input").val();
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
					controller.resetWidgets();
					setStartCaretPosition(input);
					//input.closest(".firer").trigger("focusin");
				}
			});
			
			jQuery("#simulation").delegate(".email input:not([readonly]), .inputurl input:not([readonly])", "click, focusin", function(event, data) {
				if(!jQuery(controller.keyboardKey).css("display") || jQuery(controller.keyboardKey).css("display") === "none") {
					jQuery("#jim-ipad-mask").hide();
					slideKeyboard(jQuery(controller.keyboardKey), true);
				}
				lastKeyboard = "#emailurl";
				var newInput = jQuery(this).closest(".email");
				initialInputValue = newInput.find("input").val();
				if(newInput.length===0) {
					newInput = jQuery(this).closest(".inputurl");
					initialInputValue = newInput.find("input").val();
				}
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
					controller.resetWidgets();
					setStartCaretPosition(input);
					//input.closest(".firer").trigger("focusin");
				}
			});
			
		},
		"unloadKeyboard": function() {
			var controller = this;
			if(jQuery(controller.keyboardKey).length>0) {
				jQuery(controller.keyboardKey).off();
				jQuery("#simulation").undelegate(".text:not(.number, .email, .inputurl) input:not([readonly]), .password input:not([readonly]), textarea:not([readonly])", "click");
				jQuery("#simulation").undelegate(".text:not(.number, .email, .inputurl) input:not([readonly]), .password input:not([readonly]), textarea:not([readonly])", "focusin");
				if(jQuery(controller.keyboardKey).css("display") !== "none")
					slideKeyboard(jQuery(controller.keyboardKey), false);
				jQuery(controller.keyboardKey).remove();
			}
		},
		"loadDropDown": function() {
			createDropDown();
			bindDropDown();
			var controller=this;
			jQuery("#simulation").delegate(".dropdown:not([readonly]), .nativedropdown:not([readonly])", "click", function(event, data) {
				controller.resetWidgets();
				fillDropDownOptions($(event.target).closest(".dropdown, .nativedropdown"));
				var newInput = jQuery(this);
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					if(input) {
						jQuery(".dropdown, .nativedropdown").removeClass("pressed");
					}
					input = newInput;
				}
				var position = controller.getCurrentPosition(input),
				width = parseInt(input.css("width"))/(1/jimUtil.getScale()),
				height = parseInt(input.css("height"))/(1/jimUtil.getScale());
				jQuery(controller.dropdownKey).css("top", position.y/(1/jimUtil.getScale()) + height + "px");
				jQuery(controller.dropdownKey).css("left", position.x/(1/jimUtil.getScale()) + (width/2) - (parseInt(jQuery(controller.dropdownKey).css("width"))/2) + "px");
				if(jQuery(controller.dropdownKey).css("display") === "none") {
					jQuery("#jim-ipad-mask").show();
					jQuery(controller.dropdownKey).show();
				}
				//input.closest(".firer").trigger("focusin");
			});
		},
		"unloadDropDown": function() {
			var controller=this;
			if(jQuery(controller.dropdownKey).length>0) {
				jQuery(controller.dropdownKey).off();
				jQuery("#simulation").undelegate(".dropdown:not([readonly]), .nativedropdown:not([readonly])", "click");
				if(jQuery(controller.dropdownKey).css("display") !== "none")
					jQuery(controller.dropdownKey).hide();
				jQuery(controller.dropdownKey).remove();
				jQuery("#jim-ipad-mask").remove();
			}
		},
		"loadDate": function() {
			createDate();
			bindDate();
			bindDateControls();
			var controller=this;

			jQuery("#simulation").delegate(".date input:not([readonly])", "click, focusin", function(event, data) {
				var newInput = jQuery(this).closest(".date");
				if(isComponentAssociatedinDataGrid(newInput))
					return;
				
				controller.resetWidgets();
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
				}
				var position = controller.getCurrentPosition(input),
				width = parseInt(input.css("width"))/(1/jimUtil.getScale()),
				height = parseInt(input.css("height"))/(1/jimUtil.getScale());
				jQuery(controller.dateKey).css("top", position.y/(1/jimUtil.getScale()) + height + "px");
				jQuery(controller.dateKey).css("left", position.x/(1/jimUtil.getScale()) + (width/2) - (parseInt(jQuery(controller.dateKey).css("width"))/2) + "px");
				fillDate();
				if(jQuery(controller.dateKey).css("display") === "none") {
					jQuery("#jim-ipad-mask").show();
					jQuery(controller.dateKey).show();
				}
				//input.closest(".firer").trigger("focusin");
			});
		},
		"unloadDate": function() {
			var controller=this;
			if(jQuery(controller.dateKey).length>0) {
				jQuery(controller.dateKey).off();
				jQuery(controller.dateKey+" .da_days").off();
				jQuery(controller.dateKey+" .da_months").off();
				jQuery(controller.dateKey+" .da_years").off();
				jQuery("#simulation").undelegate(".date input:not([readonly])", "click");
				jQuery("#simulation").undelegate(".date input:not([readonly])", "focusin");
				if(jQuery(controller.dateKey).css("display") !== "none")
					jQuery(controller.dateKey).hide();
				jQuery(controller.dateKey).remove();
				jQuery("#jim-ipad-mask").remove();
			}
		},
		"loadTime": function() {
			createTime();
			bindTime();
			bindTimeControls();
			var controller=this;

			jQuery("#simulation").delegate(".time input:not([readonly])", "click, focusin", function(event, data) {
				var newInput = jQuery(this).closest(".time");
				if(isComponentAssociatedinDataGrid(newInput))
					return;
				
				controller.resetWidgets();
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
				}
				fillTime();
				var position = controller.getCurrentPosition(input),
				width = parseInt(input.css("width"))/(1/jimUtil.getScale()),
				height = parseInt(input.css("height"))/(1/jimUtil.getScale());
				jQuery(controller.timeKey).css("top", position.y/(1/jimUtil.getScale()) + height + "px");
				jQuery(controller.timeKey).css("left", position.x/(1/jimUtil.getScale()) + (width/2) - (parseInt(jQuery(controller.timeKey).css("width"))/2) + "px");
				if(jQuery(controller.timeKey).css("display") === "none") {
					jQuery("#jim-ipad-mask").show();
					jQuery(controller.timeKey).show();
				}
				//input.closest(".firer").trigger("focusin");
			});
		},
		"unloadTime": function() {
			var controller=this;
			if(jQuery(controller.timeKey).length>0) {
				jQuery(controller.timeKey).off();
				jQuery(controller.timeKey+" .ti_hours").off();
				jQuery(controller.timeKey+" .ti_minutes").off();
				jQuery(controller.timeKey+" .ti_periods").off();
				jQuery("#simulation").undelegate(".time input:not([readonly])", "click");
				jQuery("#simulation").undelegate(".time input:not([readonly])", "focusin");
				if(jQuery(controller.timeKey).css("display") !== "none")
					jQuery(controller.timeKey).hide();
				jQuery(controller.timeKey).remove();
				jQuery("#jim-ipad-mask").remove();
			}
		},
		"loadDateTime": function() {
			createDateTime();
			bindDateTime();
			bindDateTimeControls();
			var controller=this;

			jQuery("#simulation").delegate(".datetime input:not([readonly])", "click, focusin", function(event, data) {
				var newInput = jQuery(this).closest(".datetime");
				if(isComponentAssociatedinDataGrid(newInput))
					return;
				
				controller.resetWidgets();
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
				}
				fillDateTime();
				var position = controller.getCurrentPosition(input),
				width = parseInt(input.css("width"))/(1/jimUtil.getScale()),
				height = parseInt(input.css("height"))/(1/jimUtil.getScale());
				jQuery(controller.datetimeKey).css("top", position.y/(1/jimUtil.getScale()) + height + "px");
				jQuery(controller.datetimeKey).css("left", position.x/(1/jimUtil.getScale()) + (width/2) - (parseInt(jQuery(controller.datetimeKey).css("width"))/2) + "px");
				if(jQuery(controller.datetimeKey).css("display") === "none") {
					jQuery("#jim-ipad-mask").show();
					jQuery(controller.datetimeKey).show();
				}
			});
		},
		"unloadDateTime": function() {
			var controller=this;
			if(jQuery(controller.datetimeKey).length>0) {
				jQuery(controller.datetimeKey).off();
				jQuery(controller.datetimeKey+" .dt_date").off();
				jQuery(controller.datetimeKey+" .dt_hours").off();
				jQuery(controller.datetimeKey+" .dt_minutes").off();
				jQuery(controller.datetimeKey+" .dt_periods").off();
				jQuery("#simulation").undelegate(".datetime input:not([readonly])", "click");
				jQuery("#simulation").undelegate(".datetime input:not([readonly])", "focusin");
				if(jQuery(controller.datetimeKey).css("display") !== "none")
					jQuery(controller.datetimeKey).hide();
				jQuery(controller.datetimeKey).remove();
				jQuery("#jim-ipad-mask").remove();
			}
		},
		"resetWidgets": function() {
			var controller=this;
			//keyboard
			if(jQuery(input).closest(".number").find("input").length > 0) {
				jQuery(controller.keyboardKey +" #letters").css('display', 'none');
				jQuery(controller.keyboardKey +" #numbers").css('display', 'block');
				jQuery(controller.keyboardKey +" #signs").css('display', 'none');
				jQuery(controller.keyboardKey +" #emailurl").css('display', 'none');
			}
			else if(jQuery(input).closest(".inputurl").find("input").length > 0) {
				jQuery(controller.keyboardKey +" #letters").css('display', 'none');
				jQuery(controller.keyboardKey +" #numbers").css('display', 'none');
				jQuery(controller.keyboardKey +" #signs").css('display', 'none');
				jQuery(controller.keyboardKey +" #emailurl").css('display', 'block');
			}
			else if(jQuery(input).closest(".email").find("input").length > 0) {
				jQuery(controller.keyboardKey +" #letters").css('display', 'none');
				jQuery(controller.keyboardKey +" #numbers").css('display', 'none');
				jQuery(controller.keyboardKey +" #signs").css('display', 'none');
				jQuery(controller.keyboardKey +" #emailurl").css('display', 'block');
			}
			else  {
				jQuery(controller.keyboardKey +" #letters").css('display', 'block');
				jQuery(controller.keyboardKey +" #numbers").css('display', 'none');
				jQuery(controller.keyboardKey +" #signs").css('display', 'none');
				jQuery(controller.keyboardKey +" #emailurl").css('display', 'none');
			}
			deactivateSpecialKeys();
			//dropdown
			jQuery(controller.dropdownKey +" .dd_options").css("top", "");
			//date
			jQuery(controller.dateKey +" .da_months").css("top", "");
			jQuery(controller.dateKey +" .da_days").css("top", "");
			jQuery(controller.dateKey +" .da_years").css("top", "");
			//time
			jQuery(controller.timeKey +" .ti_hours").css("top", "");
			jQuery(controller.timeKey +" .ti_minutes").css("top", "");
			jQuery(controller.timeKey +" .ti_periods").css("top", "");
			//datetime
			jQuery(controller.datetimeKey +" .dt_date").css("top", "");
			jQuery(controller.datetimeKey +" .dt_hours").css("top", "");
			jQuery(controller.datetimeKey +" .dt_minutes").css("top", "");
			jQuery(controller.datetimeKey +" .dt_periods").css("top", "");
		},
		"hideWidgets": function() {
			var controller = this;
			//keyboard
			jQuery(controller.keyboardKey).css('display', 'none');
			//dropdown
			jQuery(controller.dropdownKey).css('display', 'none');
			//date
			jQuery(controller.dateKey).css('display', 'none');
			//time
			jQuery(controller.timeKey).css('display', 'none');
			//datetime
			jQuery(controller.datetimeKey).css('display', 'none');
		},
	    "getCurrentPosition": function(element) {
			var positionX = element.jimPosition().left,
			positionY = element.jimPosition().top,
			parent = element.parent(),
			siblingsY, siblingsX, value;
			while(parent.prop("id")!=="simulation") {
				if(parent.hasClass("layout")) {}
				else {
					siblingsX = parent.siblings(".horizontalScroll");
					siblingsY = parent.siblings(".verticalScroll");
					if(siblingsX.length>0) {
						value = parseFloat(jQuery(siblingsX[0]).attr("desplX"));
						if(!isNaN(value) && value!==0) {
							value = parseInt(value);
							positionX += value;
						}
					}
					if(siblingsY.length>0) {
						value = parseFloat(jQuery(siblingsY[0]).attr("desplY"));
						if(!isNaN(value) && value!==0) {
							value = parseInt(value);
							positionY += value;
						}
					}
				}
				
				parent = parent.parent();
			}
			return {"x": positionX, "y": positionY };
		}
	};
	window.jimDevice.controllers["ipadIOS8"] = controller;
	
	/*********************** END STATIC ACCESS METHODS ************************/
	
}) (window);