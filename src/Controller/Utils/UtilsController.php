<?php

/**
 * Created by ${projectName}.
 * User: Filipe Batista
 * Date: 12/07/25 12:19
 */

namespace App\Controller\Utils;

use App\Entity\Property\Salon;
use App\Entity\Property\SalonRoles;
use App\Enum\SalonRoleEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;

class UtilsController
{
    public static function checkSalonRole(
        UserInterface $user,
        EntityManagerInterface $entityManager,
        Salon $salon,
        SalonRoleEnum $role
    ):JsonResponse|SalonRoles
    {
        $ownerShip = $entityManager->getRepository(SalonRoles::class)->findOneBy([
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
}
