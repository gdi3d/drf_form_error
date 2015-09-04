/**
 * common functions
 */
var drf_js = 
{
	error_suffix_id: '_error_placeholder', // sufix of error fields
	error_placeholder: '<div class="text-danger"></div>',
	/**
	 * Just for testing
	 */
	throw_error: function()
	{
		return {
			"product": {
				"amount":["The amount can't be empty", "The amount has to be a valid decimal number"],
				"name": ["The name can't be empty"],
				"description": ["Enter a description"],
				"shipment": {
						"option": ["Choose a shipment option"]
					}
				
			},
			"qty": ["Just another error", "And another one over here!"],
			"user": {
				"nickname": ["Your nickname can't be empty", "now what?"],
				"bio": ["Your bio is too short"]
			},
			"category": ["Choose a category"],
			"gender": ["Choose a gender"]
		}
	},
	/**
	 * Process the errors for django rest framework
	 * and create an array map var[field] = error to be
	 * used on show_form_error function
	 * @type {Array}
	 */
	_api_response_fields_tmp: new Array(),
	api_response_fields: new Array(),
	recursiveIteration: function(object)
	{
	    for (var property in object)
	    {
	        if (object.hasOwnProperty(property))
	        {	                
	            if (typeof object[property] == "object")
	            {
					drf_js._api_response_fields_tmp.push(property)
	                drf_js.recursiveIteration(object[property]);

	                // when the recursive finish, pop the last element
	                // so we can mantain the root and keep going
	                // 
	                // In our product key the secuence will be:
	                // _api_response_fields_tmp = ['product']
	                // _api_response_fields_tmp = ['product', 'amount']
	                // Then the recursive returns and we remove the amount key
	                // _api_response_fields_tmp = ['product']
	                // _api_response_fields_tmp = ['product', 'name']
	                // Then the recurisve returns again and we keep
	                // removing the last element until it's empty
	            	drf_js._api_response_fields_tmp.pop()
	            }
	            else
	            {
	            	if(drf_js._api_response_fields_tmp.length > 0)
	            	{
		            	field_id = drf_js._api_response_fields_tmp.join('_')
						drf_js.api_response_fields[field_id] = object
	            	}
	            }
	        }
	    }
	},
	/**
	 * Show the errors from the api on the forms
	 * @param  {object} data The response from the api
	 */
	show_form_error: function(data, form_id)
	{
		if(data)
		{
			if(form_id != 'undefined' || form_id != '')
			{
				form_id = '#' + form_id + ' '
			}
			else
			{
				form_id = ''
			}

			// convert the response into a mapped array
			drf_js.recursiveIteration(data)
			for(var k in drf_js.api_response_fields)
			{								
				v = drf_js.api_response_fields[k]

				// check if the div that acts as container exists
				if(!$('#'+k+drf_js.error_suffix_id).length)
				{
					// if field is inside an input-group we place the error div
					// outside that container so we don't break it
					if($(form_id + ':input[name="'+k+'"]').parent().hasClass('input-group'))
					{						
						$(form_id + ':input[name="'+k+'"]').parent().after(drf_js.error_placeholder)
						$(form_id + ':input[name="'+k+'"]').parent().next('div').attr('id', k+drf_js.error_suffix_id);
					}
					else
					{
						$(form_id + ':input[name="'+k+'"]').after(drf_js.error_placeholder);
						$(form_id + ':input[name="'+k+'"]').next('div').attr('id', k+drf_js.error_suffix_id);
					}
				}

				$(form_id + ':input[name="'+k+'"]').closest('div').addClass('has-error');				
				$(form_id + '#'+k+drf_js.error_suffix_id).html(v.join('<br>'))
			}			
		}
	},
	/**
	 * Clean up all the errors on the form
	 */
	clear_errors: function()
	{
		// remove classes and errors from form elements
		$('div[id*="'+drf_js.error_suffix_id+'"').html('');
		$('.has-error').removeClass('has-error');
		$('div[role="alert"]').remove();

		// reset the properties
		drf_js.api_response_fields = new Array()
		drf_js._api_response_fields = new Array()
	},
	/**
	 * Show an alert message
	 * @param {string} type Type of error to show
	 * @param {string} msg  Message
	 * @param {object} container_selector  A jQuery selector. e.g: $('#some_div')
	 */
	add_message: function(type, msg, container_selector)
	{
		switch(type)
		{
			case 'success':
				msg = '<strong>Done!</strong>&nbsp;' + msg
			break;
			case 'info':
				msg = '<strong>Heads up!</strong>&nbsp;' + msg
			break;
			case 'warning':
				msg = '<strong>Warning!</strong>&nbsp;' + msg
			break;
			case 'danger':
				msg = '<strong>Oh snap!</strong>&nbsp;' + msg
			break;
		}

		html = '<div class="alert alert-'+type+' alert-dismissible" role="alert" style="margin-top:10px"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+msg+'</div>';

		container_selector.prepend(html);

		// scroll to top
		$('html, body').animate({ scrollTop: 0 }, 'fast');
	}
}

// bind the action the the main button
$('#try').click(function(){ 
		// show the errors on the form
		drf_js.show_form_error(drf_js.throw_error(), 'transaction_form');
		// add the message at the top
		drf_js.add_message('success', 'All went well!', $('#alert_dialog_container'));
		drf_js.add_message('info', 'Remember to read the docs ;)', $('#alert_dialog_container'));
		drf_js.add_message('warning', 'Don\'t forget the bring a towel', $('#alert_dialog_container'));
		drf_js.add_message('danger', 'Check out the errors on the form', $('#alert_dialog_container'));
	});