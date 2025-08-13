<?php

namespace App\Entity\Property;

use App\Entity\User\User;
use App\Entity\Workers\WorkerRole;
use App\Enum\SalonRoleEnum;
use App\Repository\Property\SalonRolesRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SalonRolesRepository::class)]
class SalonRoles
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['salon_role:read', 'salon_roles_get'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'salonRoles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['salon_roles_get'])]
    private ?User $UserId = null;

    #[ORM\ManyToOne(inversedBy: 'salonRoles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Salon $salonId = null;

    #[Groups(['salon_roles_get'])]
    #[ORM\Column(nullable: true)]
    private ?string $title = null;
    
    #[ORM\Column(type:'json')]
    #[Groups(['salon:read', 'salon_roles_get'])]
    private ?array $roles = [];

    #[ORM\Column]
    #[Groups(['salon_roles_get'])]
    private ?bool $isActive = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $alteredAt = null;

    #[ORM\OneToOne(mappedBy: 'salonRolesId', cascade: ['persist', 'remove'])]
    private ?WorkerRole $workerRole = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?User
    {
        return $this->UserId;
    }

    public function setUserId(?User $UserId): static
    {
        $this->UserId = $UserId;

        return $this;
    }

    public function getSalonId(): ?Salon
    {
        return $this->salonId;
    }

    public function setSalonId(?Salon $salonId): static
    {
        $this->salonId = $salonId;

        return $this;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): self
    {
        $normalizedRoles = [];

        foreach ($roles as $role) {
            if ($role instanceof SalonRoleEnum) {
                $normalizedRoles[] = $role->value;
            } else {
                $enum = SalonRoleEnum::tryFrom($role);
                if (!$enum) {
                    throw new \InvalidArgumentException("Invalid role: " . (string)$role);
                }
                $normalizedRoles[] = $enum->value;
            }
        }

        $this->roles = $normalizedRoles;
        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;

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

    public function getAlteredAt(): ?\DateTimeImmutable
    {
        return $this->alteredAt;
    }

    public function setAlteredAt(?\DateTimeImmutable $alteredAt): static
    {
        $this->alteredAt = $alteredAt;

        return $this;
    }

    public function getWorkerRole(): ?WorkerRole
    {
        return $this->workerRole;
    }

    public function setWorkerRole(WorkerRole $workerRole): static
    {
        // set the owning side of the relation if necessary
        if ($workerRole->getSalonRolesId() !== $this) {
            $workerRole->setSalonRolesId($this);
        }

        $this->workerRole = $workerRole;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): void
    {
        $this->title = $title;
    }
}
