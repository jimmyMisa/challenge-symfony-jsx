<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeController extends AbstractController
{
    #[Route('/stripe', name: 'stripe_index')]
    public function stripeIndex(
        Request $request
    ): Response
    {
        $stripe_public_key = $this->getParameter("STRIPE_PUBLIC_KEY");
        return $this->render('stripe/stripe.html.twig', [
            'stripe_public_key' => $stripe_public_key,
            'controller_name' => 'StripeController',
        ]);
    }

    public function stripeCreate(
        Request $request, 
        StripeService $stripeService
    ): Response
    {
        
        $stripeSecretKey = $stripeService->getStripeSecretKey();
        Stripe::setApiKey($stripeSecretKey);

        // Retrieve the parameter from the request
        $data = json_decode($request->getContent(), true);
        // Access the token parameter
        $token = $data['token'];

        // Valeurs à définir selon le paiement à réaliser
        $amount = 2000;
        $currency = 'usd';
        $description = 'Description';

        try {
            // Create the source from the token
            $source = \Stripe\Source::create([
                'type' => 'card',
                'token' => $token,
            ]);

            // Access the source ID
            $sourceId = $source->id;

            // Use the source ID to create a charge
            $charge = \Stripe\Charge::create([
                'amount' => $amount, // The amount in cents
                'currency' => $currency,
                'source' => $sourceId,
                'description' => $description,
                'capture' => false
            ]);

            return $this->json($charge);

        } catch (\Stripe\Exception\CardException $e) {
            return $this->json(['error' => $e->getMessage()]);
        }
    }

    #[Route('/stripe/capture', name: 'stripe_capture')]
    public function stripeCapture(
        Request $request, 
        StripeService $stripeService
    ): Response
    {
        
        $stripeSecretKey = $stripeService->getStripeSecretKey();
        Stripe::setApiKey($stripeSecretKey);

        // Retrieve the parameter from the request
        $data = json_decode($request->getContent(), true);

        // Access the token parameter
        $chargeId = $data['id'];

        try {

            // Use the source ID to create a charge
            $charge = \Stripe\Charge::retrieve($chargeId);;

            // Check if the charge has been captured
            if ($charge->captured) {
                return $this->json(
                    ["message" => "Charge has already been captured."]
                );
            }
            else{
                
                // Capture the charge
                $charge->capture();
            }

            return $this->json(
                ["message" => "Charge captured successfully."]
            );

        } catch (\Stripe\Exception\CardException $e) {
            return $this->json(
                ["message" => "Error capturing charge: " . $e->getMessage()]
            );
        }
    }

    #[Route('/stripe/create-payment-intent', name: 'stripe_create_payment_intent')]
    public function stripeCreatePaymentIntent(
        Request $request, 
        StripeService $stripeService
    ): Response
    {
        
        $stripeSecretKey = $stripeService->getStripeSecretKey();
        Stripe::setApiKey($stripeSecretKey);

        // Retrieve the parameter from the request
        $data = json_decode($request->getContent(), true);
        // Access the token parameter
        $token = $data['token'];

        // Valeurs à définir selon le paiement à réaliser
        $amount = 2000;
        $currency = 'usd';
        $description = 'Description';
        
        try {
            // Create the source from the token
            $source = \Stripe\Source::create([
                'type' => 'card',
                'token' => $token,
            ]);

            // Access the source ID
            $sourceId = $source->id;

            $paymentIntent = \Stripe\PaymentIntent::create([
                'amount' => $amount, // The amount in cents
                'currency' => $currency,
                'source' => $sourceId,
                'description' => $description,
                'capture_method' => 'manual'
            ]);

            return $this->json($paymentIntent);

        } catch (\Stripe\Exception\CardException $e) {
            return $this->json(['error' => $e->getMessage()]);
        }
    }

    #[Route('/stripe/capture_payment_intent', name: 'stripe_capture_payment_intent')]
    public function stripeCapturePaymentIntent(
        Request $request, 
        StripeService $stripeService
    ): Response
    {
        
        $stripeSecretKey = $stripeService->getStripeSecretKey();
        Stripe::setApiKey($stripeSecretKey);

        // Retrieve the parameter from the request
        $data = json_decode($request->getContent(), true);

        // Access the token parameter
        $paymentIntentId = $data['id'];

        try {

            $paymentIntent = \Stripe\PaymentIntent::retrieve($paymentIntentId);;

            // Check if the payment intent has been captured
            if ($paymentIntent->status === 'succeeded') {
                return $this->json(
                    ["message" => "Payment intent has already been captured."]
                );
            }
            else{
                $paymentIntent->capture();
            }

            return $this->json(
                ["message" => "Payment Intent captured successfully."]
            );

        } catch (\Stripe\Exception\CardException $e) {
            return $this->json(
                ["message" => "Error capturing charge: " . $e->getMessage()]
            );
        }
    }
}