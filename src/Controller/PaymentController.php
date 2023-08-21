<?php

namespace App\Controller;

// src/Controller/PaymentController.php

use Stripe\Stripe;
use Stripe\Checkout\Session;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;


class PaymentController extends AbstractController
{

    #[Route('/create_payment_session', name: 'create_payment_session')]
     public function createPaymentSession(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        /*$number = $data['number'];
        $exp_month = $data['exp_month'];
        $exp_year = $data['exp_year'];
        $cvc = $data['cvc'];
        $token = $data['token'];*/

        Stripe::setApiKey($this->getParameter('STRIPE_API_KEY'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => 'Produit exemple',
                        ],
                        'unit_amount' => 2000,  // Montant en cents
                    ],
                    'quantity' => 1,
                ],
            ],
            'mode' => 'payment',
            'success_url' => $this->generateUrl('payment_success', [], UrlGeneratorInterface::ABSOLUTE_URL),
            'cancel_url' => $this->generateUrl('payment_cancel', [], UrlGeneratorInterface::ABSOLUTE_URL),
        ]);

        return $this->redirectToRoute('stripe_checkout', ['sessionId' => $session->id]);
    }

    #[Route('/payment/stripe-checkout/{sessionId}', name: 'stripe_checkout')]
    public function stripeCheckout(Request $request, $sessionId)
    {
        return $this->render('payment/stripe_checkout.html.twig', [
            'sessionId' => $sessionId,
            'stripe_publishable_key' => $this->getParameter('STRIPE_PUBLIC_KEY'),
        ]);
    }

    #[Route('/payment/checkout', name: 'payment_checkout')]
    public function checkout()
    {
        return $this->render('payment/checkout.html.twig', [
            'stripe_api_key' => $this->getParameter('STRIPE_API_KEY'),
            'stripe_publishable_key' => $this->getParameter('STRIPE_PUBLIC_KEY'),
        ]);
    }

    #[Route('/payment/success', name: 'payment_success')]
    public function paymentSuccess()
    {
        return $this->render('payment/success.html.twig');
    }

    #[Route('/payment/cancel', name: 'payment_cancel')]
    public function paymentCancel()
    {
        return $this->render('payment/cancel.html.twig');
    }
}
