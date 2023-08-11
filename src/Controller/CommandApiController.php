<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Service\CommandService;

#[Route('/api')]
class CommandApiController extends AbstractController
{
    #[Route('/command/list', name: 'command_list_api')]
    public function listAction(CommandService $commandService): JsonResponse
    {
        $commands = $commandService->getList();
        return $this->json($commands);
    }

    #[Route('/command/add', name: 'command_add_api')]
    public function addAction(Request $request, CommandService $commandService): JsonResponse
    {
        $contents = json_decode($request->getContent(), true);
        $results = $commandService->addCommand($contents);
        return $this->json($results);
    }
    #[Route('/command/edit', name: 'command_edit_api')]
    public function editAction(Request $request, CommandService $commandService): JsonResponse
    {
        $contents = json_decode($request->getContent(), true);
        $results = $commandService->editCommand($contents);

        return $this->json($results);
    }
    #[Route('/command/remove', name: 'command_remove_api')]
    public function removeAction(Request $request, CommandService $commandService): JsonResponse
    {
        $contents = json_decode($request->getContent(), true);
        $results = $commandService->removeCommand($contents);

        return $this->json($results);
    }
}
