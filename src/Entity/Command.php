<?php

namespace App\Entity;

use App\Repository\CommandRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CommandRepository::class)]
class Command
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: '0')]
    private ?string $price = null;

    #[ORM\Column(length: 255)]
    private ?string $status = null;

    #[ORM\OneToMany(mappedBy: 'command', targetEntity: CommandProduct::class)]
    private Collection $commandProducts;

    public function __construct()
    {
        $this->commandProducts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return Collection<int, CommandProduct>
     */
    public function getCommandProducts(): Collection
    {
        return $this->commandProducts;
    }

    public function addCommandProduct(CommandProduct $commandProduct): static
    {
        if (!$this->commandProducts->contains($commandProduct)) {
            $this->commandProducts->add($commandProduct);
            $commandProduct->setCommand($this);
        }

        return $this;
    }

    public function removeCommandProduct(CommandProduct $commandProduct): static
    {
        if ($this->commandProducts->removeElement($commandProduct)) {
            // set the owning side to null (unless already changed)
            if ($commandProduct->getCommand() === $this) {
                $commandProduct->setCommand(null);
            }
        }

        return $this;
    }
}
