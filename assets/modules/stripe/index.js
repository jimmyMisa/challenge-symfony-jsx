document.addEventListener("DOMContentLoaded", function(event) {
    const stripe = Stripe(window.stripe_public_key);
    var elements = stripe.elements();

    var cardNumberElement = elements.create('cardNumber', {
        // style: style,
        placeholder: 'Numéro de carte',
    });
    cardNumberElement.mount('#card-number-element');
    
    var cardExpiryElement = elements.create('cardExpiry', {
        // style: style,
        placeholder: 'Expiration',
    });
    cardExpiryElement.mount('#card-expiry-element');
    
    var cardCvcElement = elements.create('cardCvc', {
        // style: style,
        placeholder: 'CVC',
    });
    cardCvcElement.mount('#card-cvc-element');

    cardNumberElement.on('change', function(event) {
        var errorElement = document.querySelector('.error');
        errorElement.textContent = "";
    });

    var reservationForm = document.getElementById('reservation-form');
        reservationForm.addEventListener('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        stripe.createToken(cardNumberElement).then(setOutcome);
    });

    var capturePayment = document.getElementById('capture_payment');
    capturePayment.addEventListener('click', function(event) {
        capture();
    });


    function capture(params={}){
        var id = document.getElementById("capture").innerHTML; // Valeur de l'id à capturer
        
        var url = window.stripe_capture;
        var {then = () =>{}} = params;

        var captureData = {id}
        $.ajax({
            method: "POST",
            url,
            data: JSON.stringify(captureData),
            dataType: "json",
            processData: false,
            contentType: "application/json",
        }).always((result) =>{
            then(result)
        })
    }


    function setOutcome(result) {
      var errorElement = document.querySelector('.error');
      errorElement.classList.remove('visible');
      
      if (result.token) {
            
          var stripeToken = document.getElementById('reservation_payment_form_stripeToken');

          var { token = {} } = result;
          var { id: stripeTokenValue = "" } = token;
          // Set the value of the hidden field
          stripeToken.value = stripeTokenValue;
          
          submitForm();

      } else if (result.error) {
          errorElement.textContent = result.error.message;
          errorElement.classList.add('visible');
      }
    }
    function submitForm(params = {}) {
        var url = window.stripe_create_payment_intent;

        var stripeToken = document.getElementById('reservation_payment_form_stripeToken');

        var stripeTokenValue = stripeToken.value;
        // Set the value of the hidden field
        var {then = () =>{}} = params;
        var data = {
            "token": stripeTokenValue
        }

        $.ajax({
            method: "POST",
            url,
            data: JSON.stringify(data),
            dataType: "json",
            processData: false,
            contentType: "application/json",
        }).always((result) =>{
            var { id = null, client_secret:clientSecret } = result;
            (async () => {
                const {paymentIntent, error} = await stripe.confirmCardPayment(clientSecret);
                if (error) {
                  // Handle error here
                } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                  // Handle successful payment here
                }
            })();
            then(result)
        })
    }

});