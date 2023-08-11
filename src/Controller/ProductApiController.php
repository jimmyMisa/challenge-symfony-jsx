<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Service\ProductService;

#[Route('/api')]
class ProductApiController extends AbstractController
{
    #[Route('/product/list', name: 'product_list_api')]
    public function listAction(ProductService $productService): JsonResponse
    {
        $products = $productService->getList();
        return $this->json($products);
    }
    #[Route('/product/add', name: 'product_add_api')]
    public function addAction(Request $request, ProductService $productService): JsonResponse
    {
        $contents = json_decode($request->getContent(), true);
        $results = $productService->addProduct($contents);
        return $this->json($results);
    }
    #[Route('/product/edit', name: 'product_edit_api')]
    public function editAction(Request $request, ProductService $productService): JsonResponse
    {
        $contents = json_decode($request->getContent(), true);
        $results = $productService->editProduct($contents);

        return $this->json($results);
    }
    #[Route('/product/remove', name: 'product_remove_api')]
    public function removeAction(Request $request, ProductService $productService): JsonResponse
    {
        $contents = json_decode($request->getContent(), true);
        $results = $productService->removeProduct($contents);

        return $this->json($results);
    }
}
