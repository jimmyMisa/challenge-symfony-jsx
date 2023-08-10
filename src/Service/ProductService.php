<?php
namespace App\Service;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Product;

class ProductService{
    private $em;
    public function __construct(EntityManagerInterface $em){
        $this->em = $em;
    }

    public function getList(){
    	return $this->em->getRepository(Product::class)->findBy([]);
    }
}