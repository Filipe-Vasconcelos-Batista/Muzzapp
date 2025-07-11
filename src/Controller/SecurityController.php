<?php

namespace App\Controller;

use App\Repository\User\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class SecurityController extends AbstractController
{

    //for debug use to make sure the headers are getting through apache/nginx
    #[Route('/api/debug-headers', name: 'debug_headers', methods: ['GET'])]
    public function debugHeaders(Request $request): JsonResponse
    {
        return new JsonResponse([
            'authorization' => $request->headers->get('Authorization'),
            'all_headers' => $request->headers->all(),
        ]);
    }


    #[Route(path: '/api/user', name: 'app_user_info', methods: ['GET'])]
    public function getUserInfo(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse([
                'success' => false,
                'message' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            'success' => true,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'role' => $user->getRoles()
            ]
        ]);
    }


}
