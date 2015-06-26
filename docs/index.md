# Overview
It's a simple tool that allows you to show errors responses of [Django Rest Framework](http://www.django-rest-framework.org/) (or any other API's) on your forms when you're not working with a js framework like angular, backbone, etc.

It was designed to be used with [Bootstrap](http://getbootstrap.com/). But you could use it with any css framework making some minor changes.

## How does it work?
The basic idea behind the whole script is to convert: `object.field` into `object_field`.

So if Django Rest Framework or any other API returns something like:
```
{
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
```
and we wanted to show the error of **product.shipment.option** we just need to set the name of the form element to **product_shipment_option**

on **index.html**:
```
<label>Shipment</label>
<div class="checkbox">
  <label>
    <input type="checkbox" name="product_shipment_option" value="">
    On store
  </label>
</div>
<div class="checkbox">
  <label>
    <input type="checkbox" name="product_shipment_option" value="">
    Send it to my house
  </label>
</div>
```

## How can I see it in action?
You can open **index.html** to see a full the examples. Just click the button at the bottom of the form.

## How to use it?
First add **drf_form_error.js** to your html file and then send the API error response to **drf_js.show_form_error(drf_error_response)** method.

This will automatically add the error messages and the **has-error** class to the container div.

There's a small issue when using radio/checkbox groups. For this elements you should use this workaround:

```
<label>Gender</label>
<div class="radio">
  <label>
    <input type="radio" name="gender" value="option1">
    Male
  </label>
</div>
<div class="radio">
  <label>
    <input type="radio" name="gender" value="option2">
    Female
  </label>
</div>
<!-- Handling automatic error placeholders with radio elements is not
	an easy task, so we do it the chuck norris way, just hack it! -->
<p id="gender_error_placeholder" class="text-danger"></p>
```
where `<p id="gender_error_placeholder" class="text-danger"></p>` prevents the js to create a container for that element error.

**Notice the _error_placeholder suffix, this has to match with the suffix setted on drf_js.error_suffix_id**

## Extra
This library has an extra method **drf_js.add_message**. This method will add a message at the top of the screen and can be setted with multiple states:

* drf_js.add_message('success', 'All went well!', $('#alert_dialog_container'));
* drf_js.add_message('info', 'Remember to read the docs ;)', $('#alert_dialog_container'));
* drf_js.add_message('warning', 'Don\'t forget the bring a towel', $('#alert_dialog_container'));
* drf_js.add_message('danger', 'Check out the errors on the form', $('#alert_dialog_container'));
