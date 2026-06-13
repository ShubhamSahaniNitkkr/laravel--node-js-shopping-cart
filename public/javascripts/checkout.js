Stripe.setPublishableKey('pk_test_RFXGAhCdGR9xtfkwDuVgE0jy');

var $form = $('#checkout-form');
var isDemoMode = $form.data('demo') === true || $form.data('demo') === 'true';

$form.submit(function(event){
  event.preventDefault();
  $('#payment-errors').addClass('d-none');
  $form.find('button').prop('disabled', true);

  if (isDemoMode) {
    $form.get(0).submit();
    return false;
  }

  Stripe.card.createToken({
    number: $('#card-number').val(),
    name: $('#card-name').val(),
    exp_month: $('#expiry-date').val(),
    cvc: $('#cvc').val()
  }, stripeResponseHandler);
  return false;
});

function stripeResponseHandler(status, response){
  if(response.error){
    $('#payment-errors').text(response.error.message);
    $('#payment-errors').removeClass('d-none');
    $form.find('button').prop('disabled', false);
  } else {
    var token = response.id;
    $form.append($('<input type="hidden" name="stripeToken"/>').val(token));
    $form.get(0).submit();
  }
}
