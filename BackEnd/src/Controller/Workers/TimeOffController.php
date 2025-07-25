<?php

namespace App\Controller\Workers;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TimeOffController extends AbstractController
{
    #[Route('/workers/timeoff/{id}', name: 'app_workers_time_off')]
    public function index(
        int $id,
        Request $request
    ): Response
    {

    }
}
