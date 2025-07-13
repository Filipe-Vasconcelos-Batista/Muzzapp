<?php

namespace App\Controller\Property;

use App\Controller\Utils\UtilsController;
use App\Entity\Property\Salon;
use App\Entity\Property\SalonRoles;
use App\Entity\User\User;
use App\Enum\SalonRoleEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class SalonRolesController extends AbstractController
{
    public function __construct(
        private readonly UtilsController $utils,
        private readonly EntityManagerInterface $entityManager
    ) {}

    #[Route('/api/salon/user/role/{id}', name: 'app_create_user_and_salon_role', methods: ['POST'])]
    public function createSalonRole(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        int $id
        ): JsonResponse
    {
        $salon=$this->utils->findSalon($id);
        $data= json_decode($request->getContent(), true);


        $user= new User();
        if(empty($data['email'])){
            $data['email']= $data['firstName'] . $data['lastName'] . "@" . $salon->getName() . ".com";
            $data['isSystemEmail']=true;
        }

        $user
            ->setEmail($data['email'])
            ->setPassword($passwordHasher->hashPassword($user,$data['password']))
            ->setFirstName($data['firstName'])
            ->setLastName($data['lastName'])
            ->setPhoneNumber($data['phoneNumber'])
            ->setCreatedAt(new \DateTimeImmutable())
            ->setAcceptedTermsAt(new \DateTimeImmutable());
        $user->setIsSystemEmail($data['isSystemEmail'] ?? false );
        $this->entityManager->persist($user);

        $roleLink=$this->createWorkerRoles($salon,$user);

        return new JsonResponse([
            'Success'=> true,
            'data' => [
                'user' => $user,
                'salonRole' => $roleLink
            ]
        ],201);
    }

    #[Route('/api/salon/role/{id}', name: 'app_property_salon_role', methods: ['POST'])]
    public function addSalonRole(
        Request $request,
        int $id
    ): JsonResponse
    {
        $salon=$this->utils->findSalon($id);
        $data= json_decode($request->getContent(), true);
        $user= $this->utils->findUser($data['email']);

        $roleLink=$this->createWorkerRoles($salon,$user);

        return new JsonResponse([
            'Success'=> true,
            'data' => [
                'user' => $user,
                'salonRole' => $roleLink
            ]
        ],201);
    }

    private function createWorkerRoles(Salon $salon, User $user): SalonRoles
    {
        $roleLink= new SalonRoles();
        $roleLink->setUserId($user);
        $roleLink->setSalonId($salon);
        $roleLink->setRole(SalonRoleEnum::ROLE_WORKER);
        $roleLink->setIsActive(true);
        $roleLink->setCreatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($roleLink);
        $this->entityManager->flush();

        return $roleLink;
    }
}
