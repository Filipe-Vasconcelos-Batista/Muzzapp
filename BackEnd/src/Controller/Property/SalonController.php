<?php

namespace App\Controller\Property;

use App\Controller\Utils\UtilsController;
use App\Entity\Property\Salon;
use App\Entity\Property\SalonRoles;
use App\Entity\User\User;
use App\Enum\SalonRoleEnum;
use App\Form\Property\SalonType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

final class SalonController extends AbstractController
{
    public function __construct(
        private readonly UtilsController $utils,
        private readonly SerializerInterface $serializer
    ) {}
    #[Route('api/salon/create', name: 'app_salon_create', methods: ['POST'])]
    public function createSalon(
        Request $request,
        EntityManagerInterface $entityManager,
    ): JsonResponse
    {
        $ownerWorker = filter_var($request->query->get('isOwnerWorker', false), FILTER_VALIDATE_BOOLEAN);

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
        $roles= [SalonRoleEnum::ROLE_OWNER];
        if ($ownerWorker) {
            $roles[] = SalonRoleEnum::ROLE_WORKER;
        }
        $user= $this->getUser();
        $roleLink= new SalonRoles();
        $roleLink->setUserId($user);
        $roleLink->setSalonId($salon);
        $roleLink->setRoles($roles);
        $roleLink->setIsActive(true);
        $roleLink->setCreatedAt(new \DateTimeImmutable());


        $entityManager->persist($roleLink);
        $entityManager->flush();

        $context = ['groups' => ['salon:read']];
        return new JsonResponse([
            'success'=>true,
            'data'   => [
                'salon'=>json_decode($this->serializer->serialize($salon, 'json',$context)) ,
            ],
        ], 201);


    }

    #[Route('api/salon/{id}', name: 'app_salon_patch', methods: ['Patch'])]
    public function patchSalon(
        Request $request,
        int $id,
        EntityManagerInterface $entityManager,
    ): JsonResponse
    {
        $salon = $entityManager->getRepository(Salon::class)->find($id);

        if(!$salon){
            return new JsonResponse(['success'=>false, 'errors'=> ['Salon not found']],404);
        }
        $response = $this->utils->checkSalonRole($this->getUser(), $salon, SalonRoleEnum::ROLE_OWNER);

        if($response instanceof JsonResponse){
            return $response;
        }
        $form  = $this->createForm(SalonType::class,$salon);
        $form->submit(json_decode($request->getContent(), true),false);

        if (!$form->isSubmitted() || !$form->isValid()) {
            $errors = [];
            foreach ($form->getErrors(true) as $err) {
                $errors[] = $err->getMessage();
            }
            return new JsonResponse(['success'=>false,'errors'=>$errors], 400);
        }

        $entityManager->flush();

        return new JsonResponse([
            'success'=>true,
            'data'   => ['salon'=>$salon],
        ], 201);
    }

    #[Route('api/salon/{id}', name: 'app_salon_delete', methods: ['DELETE'])]
    public function deleteSalon(
        int $id,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $salon = $entityManager->getRepository(Salon::class)->find($id);

        if (!$salon) {
            return new JsonResponse(['success' => false, 'errors' => ['Salon not found']], 404);
        }

        $response = $this->utils->checkSalonRole($this->getUser(), $salon, SalonRoleEnum::ROLE_OWNER);

        if($response instanceof JsonResponse){
            return $response;
        }

        $entityManager->remove($salon);
        $entityManager->flush();

        return new JsonResponse(['success' => true, 'message' => 'Salon deleted successfully']);
    }
    #[Route('api/salon/{id}', name: 'app_salon_get', methods: ['GET'])]
    public function findSalons(
        int $id,
        EntityManagerInterface $entityManager,
    ): JsonResponse
    {
        $salonRoles = $entityManager->getRepository(SalonRoles::class)->findBy([
            'UserId' => $id,
            'isActive' => true
        ]);

        $salons = array_map(fn($role) => $role->getSalonId(), $salonRoles);

        return new JsonResponse([
            'success' => true,
            'data' => $salons
        ]);
    }

    #[Route('api/salon/owner/{id}', name: 'app_salon_get', methods: ['GET'])]
    public function findOwnedSalons(
        int $id,
        EntityManagerInterface $entityManager,
    ): JsonResponse
    {
        $salonRoles = $entityManager->getRepository(SalonRoles::class)->findBy([
            'UserId' => $id,
            'isActive' => true

        ]);

        $salons = array_map(fn($role) => $role->getSalonId(), $salonRoles);

        $context = ['groups' => ['salon:read']];
        return new JsonResponse([
            'success' => true,
            'salons'=>json_decode($this->serializer->serialize($salons, 'json',$context)) ,
        ]);
    }

}
