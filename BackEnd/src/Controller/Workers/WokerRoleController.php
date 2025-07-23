<?php

namespace App\Controller\Workers;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class WokerRoleController extends AbstractController
{
    #[Route('/workers/woker/role', name: 'app_workers_woker_role')]
    public function index(): Response
    {
        return $this->render('workers/woker_role/index.html.twig', [
            'controller_name' => 'WokerRoleController',
        ]);
    }
}
