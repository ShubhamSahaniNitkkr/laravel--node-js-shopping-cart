Stripe.setPublishableKey('pk_test_RFXGAhCdGR9xtfkwDuVgE0jy');

var $form = $('#checkout-form');

$form.submit(function(event){
  $('#payment-errors').addClass('d-none');
  $form.find('button').prop('disabled',true);
  Stripe.card.createToken({
    number : $('#card-number').val();
    name : $('#card-name').val();
    exp_month : $('#expiry-date').val();
    cvc : $('#cvc').val();
    name : $('#name').val();
  },stripeResponseHandler);
  return false;
});


function stripeResponseHandler(status, response){
  if(response.error){
    $('#payment-errors').text(response.error.message);
    $('#payment-errors').removeClass('d-none');
    $form.find('button').prop('disabled',false);
  }else{
    var token = response.id;
    $form.append($('<input type="hidden" name="stripeToken"/>').val(token));
    $form.get(0).submit();

  }
}
