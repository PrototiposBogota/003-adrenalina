/*!
 * Copyright 2013 Justinmind. All rights reserved.
 */

(function (window, undefined) {
  jQuery("#simulation")
  .on('mousedown', ".radiobutton.inputIOS", function(event, value) {
	var $target = jQuery(event.target);
	var target = event.target;
	if ($target.hasClass("backgroundLayer")) {
		$target = $target.parent();
		target = $target[0];
	}
	var disabled = $target.attr("disabled") && $target.attr("disabled").length>0;
	
	if(!disabled) {
		if(!$target.attr("name")) {
			if(value !== 'false')
				$target.attr("checked", true);
			else $target.attr("checked", false);
		}
		else {
			//radios inside groups
			radioGroup($target).each(function() { 
		      if (this===target && value !== 'false') { 
		          $(this).attr("checked", true);
		      } else { 
		          $(this).attr("checked", false);
		          jimUtil.forceReflow();
		      } 
		    });
			//radiobutton list
			radioList($target).each(function() { 
		      if (this===target && value !== 'false') { 
		          $(this).attr("checked", true);
		      } else { 
		          $(this).attr("checked", false);
		          jimUtil.forceReflow();
		      } 
		    });
		}
	}
  })
  .on('mousedown', ".checkbox.inputIOS", function(event) {
	var $target = jQuery(event.target);
	if ($target.hasClass("backgroundLayer")) $target = $target.parent();
	var disabled = $target.attr("disabled") && $target.attr("disabled").length>0;
	var selected = ($target.attr("checked") && ($target.attr("checked")==="checked" || $target.attr("checked")===true));
	
	if(!disabled) {
		if(selected===undefined || selected===false) {
			$target.attr("checked", true);
		}
		else if(selected===true) {
			$target.attr("checked", false);
		}
	}
  });
  
  radioGroup = function($radio) { 
	var name = $radio.attr("name"), 
	form = jQuery("#simulation"), 
	radios = $( [] ); 
	if (name) { 
	  if (form) { 
	    radios = $(form).find( "[name='" + name + "']" ); 
	  } else { 
	    radios = $( "[name='" + name + "']", radio.ownerDocument ) 
	    .filter(function() { 
	       return !this.form; 
	    }); 
	  } 
	} 
	return radios; 
  }; 
  
  radioList = function($radio) { 
    var form = $radio.closest(".collapse"), 
	radios = $( [] ); 
	if (form) { 
	  radios = $(form).find(".radiobutton"); 
	} else { 
	  radios.add($radio);
	} 
	return radios; 
  }; 

})(window);