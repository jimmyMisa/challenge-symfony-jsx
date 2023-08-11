<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Service\CommandService;

class CommandController extends AbstractController
{
    #[Route('/command', name: 'app_command')]
    public function index(): Response
    {
        return $this->render('command/index.html.twig', [
            'controller_name' => 'CommandController',
        ]);
    }
}
