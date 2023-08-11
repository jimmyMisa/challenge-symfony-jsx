<?php
namespace App\Service;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Product;
use App\Entity\CommandProduct;

class ProductService{
    private $em;
    public function __construct(EntityManagerInterface $em){
        $this->em = $em;
    }

    public function getList(){
    	$products = $this->em->getRepository(Product::class)->findBy([]);
        $results = [];
        foreach ($products as $product) {
            $results[]= [
                "id" => $product->getId(),
                "name" => $product->getName(),
                "price" => $product->getPrice(),
            ];
        }

        return $results;
    }

    public function addProduct($contents)
    {
        $results = [
            "status" => 500,
            "message" => "Le produit est vide"
        ];
        $data = [];
        if ($contents && isset($contents["query"])) {
            $data = $contents["query"];
        }
        if (
            !$data || 
            !isset($data["name"]) ||
            !isset($data["price"])
        ) {
            return $results;
        }
        $product_name = $data["name"];
        $price = $data["price"];
        if (!$price || !$product_name) {
            return $results;
        }
        $results = [
            "status" => 200,
            "message" => "Le produit a été crée avec succés"
        ];
        $product = new Product();
        $product->setName($product_name);
        $product->setPrice($price);
        $this->em->persist($product);
        $this->em->flush();

        return $results;
    }

    public function editProduct($contents)
    {
        $data = [];
        $results = [
            "status" => 500,
            "message" => "Le produit est incorrect"
        ];
        if ($contents && isset($contents["query"])) {
            $data = $contents["query"];
        }

        if (
            !$data || 
            !isset($data["id"]) ||
            !isset($data["name"]) ||
            !isset($data["price"])
        ) {
            return [
                "status" => 500,
                "error" => [
                    "code" => "PARAMS_ERROR",
                ],
            ];
        }
        $id = trim($data["id"]);
        $product_name = trim($data["name"]);
        $price = trim($data["price"]);
        if (!$id || !$price || !$product_name) {
            return [
                "status" => 500,
                "error" => [
                    "code" => "PARAMS_ERROR",
                ],
            ];
        }
        $product = $this->em->getRepository(Product::class)->findOneBy(["id" => $id]);
        if (!$product) {
            return [
                "status" => 500,
                "error" => [
                    "code" => "PRODUCT_NOT_FOUND",
                ],
            ];
        }
        $results = [
            "status" => 200,
            "message" => "Le produit a été mis à jour avec succés"
        ];
        $product->setName($product_name);
        $product->setPrice($price);
        $this->em->flush();

        return $results;
    }

    public function removeProduct($contents)
    {
        $data = [];
        $product_id = null;
        $results = [
            "status" => 500,
            "error" => [
                "code" => "PRODUCT_NOT_FOUND",
            ],
        ];
        
        if ($contents && isset($contents["query"])) {
            $data = $contents["query"];
        }
        if ($data && isset($data["id"])) {
            $product_id = $data["id"];
        }
        if (!$product_id) {
            return [
                "status" => 500,
                "error" => [
                    "code" => "PARAMS_ERROR",
                ],
            ];
        }
        $product = $this->em->getRepository(Product::class)->findOneBy([
            "id" => $product_id
        ]);
        if (!$product) {
            return $results;
        }
        $results = [
            "status" => 200,
            "message" => "Le produit a été supprimé avec succés"
        ];
        $commandProducts = $this->em->getRepository(CommandProduct::class)->findBy([
            "product" => $product
        ]);
        foreach ($commandProducts as $commandProduct) {
            $commandProduct->setProduct(null);
        }
        $this->em->remove($product);
        $this->em->flush();

        return $results;
    }
}