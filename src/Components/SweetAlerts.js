import Swal from 'sweetalert2';

export function errorAlert(e) {
	return Swal.fire({
		title: 'Error!',
		text: e,
		icon: 'error',
		confirmButtonText: 'Cool',
	});
}

export function successAlert(title = 'Success!', text = '') {
	return Swal.fire(title, text, 'success');
}

export function notifyAlert(text, title = '') {
	return Swal.fire({
		title: title,
		icon: 'info',
		html: text,
	});
}

export function invalidOperationAlert(text, title = 'Please try again') {
	return Swal.fire({
		title: title,
		icon: 'warning',
		html: text,
	});
}

export function irreversibleOperationAlert(
	text,
	confirm = 'Ok',
	deny = 'No',
	title = 'No going back'
) {
	return Swal.fire({
		title: title,
		icon: 'warning',
		html: text,
		showDenyButton: true,
		showConfirmButton: true,
		denyButtonText: deny,
		confirmButtonText: confirm,
	});
}
