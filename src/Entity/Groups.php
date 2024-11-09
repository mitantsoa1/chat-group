<?php

namespace App\Entity;

use App\Repository\GroupsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GroupsRepository::class)]
#[ORM\Table(name: '`groups`')]
class Groups
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $members = [];

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getMembers(): ?array
    {
        return $this->members;
    }

    public function setMembers(?array $members): static
    {
        $this->members = $members;
        return $this;
    }

    public function addMember(int $member): static
    {
        if (!is_array($this->members)) {
            $this->members = [];
        }

        if (!in_array($member, $this->members)) {
            $this->members[] = $member;
        }

        return $this;
    }

    public function removeMember(int $member): static
    {
        if (is_array($this->members)) {
            $key = array_search($member, $this->members);
            if ($key !== false) {
                unset($this->members[$key]);
                $this->members = array_values($this->members); // Réindexe le tableau
            }
        }

        return $this;
    }
}
