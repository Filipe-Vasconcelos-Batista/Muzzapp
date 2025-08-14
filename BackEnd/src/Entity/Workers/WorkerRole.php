<?php

namespace App\Entity\Workers;

use App\Entity\Property\SalonRoles;
use App\Entity\Scheduling\Calendar;
use App\Entity\Services\Details;
use App\Repository\Workers\WorkerRoleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: WorkerRoleRepository::class)]
class WorkerRole
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['salon_roles_get'])]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'workerRole', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?SalonRoles $salonRolesId = null;

    #[ORM\Column(type: Types::JSON)]
    #[Groups(['salon_roles_get'])]
    private array $weeklySchedule = [];

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $changedAt = null;

    #[ORM\ManyToOne(inversedBy: 'workerRoleId')]
    private ?TimeOff $timeOff = null;

    /**
     * @var Collection<int, Calendar>
     */
    #[ORM\OneToMany(targetEntity: Calendar::class, mappedBy: 'workerRoleId')]
    private Collection $calendars;

    #[ORM\ManyToOne(inversedBy: 'workerRoleId')]
    private ?Details $details = null;

    public function __construct()
    {
        $this->calendars = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSalonRolesId(): ?SalonRoles
    {
        return $this->salonRolesId;
    }

    public function setSalonRolesId(SalonRoles $salonRolesId): static
    {
        $this->salonRolesId = $salonRolesId;

        return $this;
    }

    public function getWeeklySchedule(): array
    {
        return $this->weeklySchedule;
    }

    public function setWeeklySchedule(array $weeklySchedule): self
    {
        $this->weeklySchedule = $weeklySchedule;
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

    public function getChangedAt(): ?\DateTimeImmutable
    {
        return $this->changedAt;
    }

    public function setChangedAt(\DateTimeImmutable $changedAt): static
    {
        $this->changedAt = $changedAt;

        return $this;
    }

    public function getTimeOff(): ?TimeOff
    {
        return $this->timeOff;
    }

    public function setTimeOff(?TimeOff $timeOff): static
    {
        $this->timeOff = $timeOff;

        return $this;
    }

    /**
     * @return Collection<int, Calendar>
     */
    public function getCalendars(): Collection
    {
        return $this->calendars;
    }

    public function addCalendar(Calendar $calendar): static
    {
        if (!$this->calendars->contains($calendar)) {
            $this->calendars->add($calendar);
            $calendar->setWorkerRoleId($this);
        }

        return $this;
    }

    public function removeCalendar(Calendar $calendar): static
    {
        if ($this->calendars->removeElement($calendar)) {
            // set the owning side to null (unless already changed)
            if ($calendar->getWorkerRoleId() === $this) {
                $calendar->setWorkerRoleId(null);
            }
        }

        return $this;
    }

    public function getDetails(): ?Details
    {
        return $this->details;
    }

    public function setDetails(?Details $details): static
    {
        $this->details = $details;

        return $this;
    }
}
