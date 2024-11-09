<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MessageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
#[ApiResource()]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['message'])]
    private ?string $body = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'messages')]
    #[Groups(['message'])]
    private ?User $user = null;

    #[ORM\Column(type: Types::JSON)]
    #[Groups(['message'])]
    private array $sendTo = [];

    public function __construct()
    {
        $this->sendTo = [];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBody(): ?string
    {
        return $this->body;
    }

    public function setBody(?string $body): static
    {
        $this->body = $body;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getSendTo(): array
    {
        return $this->sendTo;
    }

    public function setSendTo(array $sendTo): self
    {
        $this->sendTo = array_values(array_unique($sendTo));
        return $this;
    }

    public function addSendTo(int $groupId): self
    {
        if (!in_array($groupId, $this->sendTo, true)) {
            $this->sendTo[] = $groupId;
        }
        return $this;
    }

    public function removeSendTo(int $groupId): self
    {
        $this->sendTo = array_values(array_diff($this->sendTo, [$groupId]));
        return $this;
    }
}
