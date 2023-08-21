<?php
// src/Controller/FileUploadController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\File;
use App\Form\FileUploadType;
use App\Service\FileService;

class FileUploadController extends AbstractController
{
    #[Route('/upload/form', name: 'file_upload_form')]
    public function uploadForm(Request $request, FileService $fileService): Response
    {
        $form = $this->createForm(FileUploadType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $file = $form['file']->getData();
            $results = $fileService->uploadFile($file);
            if ($results && is_array($results)) {
                if (isset($results["status"]) && $results["status"] == 500) {
                    $this->addFlash('error', $results["message"]);
                }
                if (isset($results["status"]) && $results["status"] == 200) {
                    $this->addFlash('success', $results["message"]);
                }
            }
            else {
                $this->addFlash('error', "Une erreur est survenue, veuillez réessayer plus tard");
            }
        }

        return $this->render('upload/index.html.twig', [
            'form' => $form->createView(),
            'controller' => "FileUploadController",
        ]);
    }

    #[Route('/upload/dropzone', name: 'file_upload_dropzone')]
    public function uploadDropzone(Request $request): Response
    {
        return $this->render('upload/dropzone.html.twig', [
            'controller' => "FileUploadController"
        ]);
    }
    
    #[Route('/api/upload/dropzone', name: 'api_file_upload_dropzone')]
    public function apiUploadDropzone(Request $request, FileService $fileService): JsonResponse
    {
        $file = $request->files->get('file');
        $results = $fileService->uploadedFiles(
            $file, 
            $request
        );
        
        return new JsonResponse($results);
    }
    
    #[Route('/api/remove/dropzone', name: 'api_file_remove_dropzone')]
    public function apiRemoveDropzone(
        Request $request, 
        FileService $fileService
    ): JsonResponse
    {
        $file_id = $request->request->get('id');
        $file = $fileService->getFileById($file_id);
        $result = $fileService->removeFile($file);
        if (!$result) {
            return new JsonResponse([
                "status" => 500,
                'message' => 'Une erreur est survenue, veuillez réessayer plus tard'
            ]);
        }
        return new JsonResponse([
            "status" => 200,
            'message' => 'Fichier supprimé avec succès'
        ]);
    }

    #[Route('/api/load/dropzone', name: 'api_file_reload_dropzone')]
    public function apiLoadDropzone(
        Request $request, 
        FileService $fileService
    ): JsonResponse
    {
        $results = $fileService->getFiles(
            $request
        );
        return new JsonResponse($results);
    }
}
