<?php

/**
 * Created by ${projectName}.
 * User: Filipe Batista
 * Date: 12/07/25 12:19
 */

namespace App\Controller\Utils;

use App\Entity\Property\Salon;
use App\Entity\Property\SalonRoles;
use App\Entity\User\User;
use App\Enum\SalonRoleEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\User\UserInterface;

class UtilsController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }
    public function checkSalonRole(
        UserInterface $user,
        Salon $salon,
        SalonRoleEnum $role
    ):JsonResponse|SalonRoles
    {
        $ownerShip = $this->entityManager->getRepository(SalonRoles::class)->findOneBy([
            'userId' => $user,
            'salonId' => $salon,
            'role' => $role,
            'isActive' => true
        ]);
        if (!$ownerShip) {
            return new JsonResponse(['success' => false, 'errors' => 'User has no authorization'], 403);
        }
        return $ownerShip;
    }

    public function findSalon(int $id): Salon
    {
        $salon= $this->entityManager->getRepository(Salon::class)->find($id);
        if(!$salon){
            throw new NotFoundHttpException('Salon not found');
        }
        return $salon;
    }

    public function findUser(string $email): User
    {
        $user= $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if(!$user){
            throw new NotFoundHttpException('User not found');
        }
        return $user;
    }
}
