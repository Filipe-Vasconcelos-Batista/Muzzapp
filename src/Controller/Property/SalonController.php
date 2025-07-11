<?php

namespace App\Controller\Property;

use App\Entity\Property\Salon;
use App\Entity\Property\SalonRoles;
use App\Enum\SalonRoleEnum;
use App\Form\Property\SalonType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;

final class SalonController extends AbstractController
{
    #[Route('api/salon/create', name: 'app_salon_create', methods: ['POST'])]
    public function createSalon(
        Request $request,
        EntityManagerInterface $entityManager,
    ): JsonResponse
    {
        $salon = new Salon();
        $form  = $this->createForm(SalonType::class, $salon);
        $form->submit(json_decode($request->getContent(), true));

        if (!$form->isSubmitted() || !$form->isValid()) {
            $errors = [];
            foreach ($form->getErrors(true) as $err) {
                $errors[] = $err->getMessage();
            }

            return new JsonResponse(['success'=>false,'errors'=>$errors], 400);
        }

        $entityManager->persist($salon);

        $user= $this->getUser();
        $roleLink= new SalonRoles();
        $roleLink->setUserId($user);
        $roleLink->setSalonId($salon);
        $roleLink->setRole(SalonRoleEnum::ROLE_OWNER);
        $roleLink->setIsActive(true);
        $roleLink->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($roleLink);

        $entityManager->flush();



        return new JsonResponse([
            'success'=>true,
            'data'   => ['salon'=>$salon, 'OwnerRole'=>$roleLink],
        ], 201);


    }
}
