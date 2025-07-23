<?php

namespace App\Controller\Workers;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TimeOffController extends AbstractController
{
    #[Route('/workers/time/off', name: 'app_workers_time_off')]
    public function index(): Response
    {
        return $this->render('workers/time_off/index.html.twig', [
            'controller_name' => 'TimeOffController',
        ]);
    }
}
