<?php
namespace App\Service;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Command;
use App\Entity\Product;
use App\Entity\CommandProduct;

class CommandService {
    private $em;
    public function __construct(EntityManagerInterface $em){
        $this->em = $em;
    }

    public function getList(){
        $em = $this->em;
        $commands = $em->getRepository(Command::class)->findAll();
        $products = $em->getRepository(Product::class)->findAll();
        $repo = $em->getRepository(CommandProduct::class);

        $results = [];
        foreach ($commands as $command) {
            $commandproducts = $repo->findBy([
                "command" => $command
            ]);
            $product_command_ids = [];
            $quantity = null;
            $product = null;
            if ($commandproducts && isset($commandproducts[0]) && $commandproducts[0]) {
                $commandproduct = $commandproducts[0];
                $quantity = $commandproduct->getQuantity();
                if ($commandproduct->getProduct()) {
                    $product=$commandproduct->getProduct()->getId();
                }
            }
            /*foreach ($commandproducts as $commandproduct) {
                if ($commandproduct->getProduct()) {
                    $product_command_ids[]=$commandproduct->getProduct()->getId();
                }
                $quantity = $commandproduct->getQuantity();
            }*/
            $results[]= [
                "id" => $command->getId(),
                "name" => $command->getName(),
                "price" => $command->getPrice(),
                "status" => $command->getStatus(),
                "quantity" => $quantity,
                "product" => $product,
                // "product_command_ids" => $product_command_ids,
            ];
        }
        $result_products = [];
        foreach ($products as $product) {
            $result_products[] = [
                "value" =>$product->getId(),
                "content" =>$product->getName(),
                "price" =>$product->getPrice(),
            ];
        }

    	return [
            "commands" =>$results,
            "products" =>$result_products,
        ];
    }

    public function addCommand($contents)
    {
        $results = [
            "status" => 500,
            "message" => "La commande est incorrecte"
        ];
        $data = [];
        if ($contents && isset($contents["query"])) {
            $data = $contents["query"];
        }
        if (
            !$data || 
            !isset($data["name"]) ||
            !isset($data["price"]) ||
            !isset($data["status"]) ||
            !isset($data["product"])
        ) {
            return $results;
        }
        $command_name = $data["name"];
        $price = $data["price"];
        $status = $data["status"];
        $product_id = $data["product"];
        $quantity = $data["quantity"];
        if (
            !$price || 
            !$status || 
            !$quantity || 
            !$product_id || 
            !$command_name
        ) {
            return $results;
        }

        $product = $this->em->getRepository(Product::class)->findOneBy(["id" => $product_id]);

        if (!$product) {
            return [
                "status" => 500,
                "message" => "Produit introuvable"
            ];
        }

        $results = [
            "status" => 200,
            "message" => "La commande a été crée avec succés"
        ];

        $command = new Command();
        $command->setName($command_name);
        $command->setPrice($price);
        $command->setStatus($status);
        $this->em->persist($command);

        $commandProduct = new CommandProduct();
        $commandProduct->setQuantity($quantity);
        $commandProduct->setPrice($price);
        $commandProduct->setCommand($command);
        $commandProduct->setProduct($product);
        $this->em->persist($commandProduct);

        $this->em->flush();

        return $results;
    }

    public function editCommand($contents)
    {
        $results = [
            "status" => 500,
            "message" => "La commande est incorrecte"
        ];
        $data = [];
        if ($contents && isset($contents["query"])) {
            $data = $contents["query"];
        }
        if (
            !$data || 
            !isset($data["id"]) ||
            !isset($data["name"]) ||
            !isset($data["price"]) ||
            !isset($data["status"]) ||
            !isset($data["product"])
        ) {
            return $results;
        }
        $command_id = $data["id"];
        $command_name = $data["name"];
        $price = $data["price"];
        $status = $data["status"];
        $product_ids = $data["product"];
        $quantity = $data["quantity"];
        if (
            !$command_id || 
            !$price || 
            !$status || 
            !$quantity || 
            !$product_ids || 
            !$command_name
        ) {
            return $results;
        }

        $command = $this->em->getRepository(Command::class)->findOneBy(["id" => $command_id]);
        if (!$command) {
            return [
                "status" => 500,
                "message" => "Commande introuvable"
            ];
        }

        $products = $this->em->getRepository(Product::class)->findBy(["id" => $product_ids]);
        if (!$products) {
            return [
                "status" => 500,
                "message" => "Produit introuvable"
            ];
        }

        $results = [
            "status" => 200,
            "message" => "La commande a été crée avec succés"
        ];
        $commandProduct = null;
        $commandProducts = $this->em->getRepository(CommandProduct::class)->findBy([
            "command" => $command
        ]);
        if ($commandProducts && isset($commandProducts[0])) {
            $commandProduct = $commandProducts[0];
        }
        if (!$commandProduct) {
            $commandProduct = new CommandProduct();
            $this->em->persist($commandProduct);
        }

        $command->setName($command_name);
        $command->setPrice($price);
        $command->setStatus($status);

        $commandProduct->setQuantity($quantity);
        $commandProduct->setPrice($price);
        $commandProduct->setCommand($command);
        foreach ($products as $product) {
            $commandProduct->setProduct($product);
        }

        $this->em->flush();

        return $results;
    }


    public function removeCommand($contents)
    {
        $data = [];
        $command_id = null;
        $results = [
            "status" => 500,
            "message" => "Commande introuvable"
        ];
        
        if ($contents && isset($contents["query"])) {
            $data = $contents["query"];
        }
        if ($data && isset($data["id"])) {
            $command_id = $data["id"];
        }
        if (!$command_id) {
            return $results;
        }
        $command = $this->em->getRepository(Command::class)->findOneBy([
            "id" => $command_id
        ]);
        if (!$command) {
            return $results;
        }
        $results = [
            "status" => 200,
            "message" => "La commande a été supprimé avec succés"
        ];
        $commandProducts = $this->em->getRepository(CommandProduct::class)->findBy([
            "command" => $command
        ]);
        foreach ($commandProducts as $commandproduct) {
            $this->em->remove($commandproduct);
        }
        $this->em->remove($command);
        $this->em->flush();

        return $results;
    }
}