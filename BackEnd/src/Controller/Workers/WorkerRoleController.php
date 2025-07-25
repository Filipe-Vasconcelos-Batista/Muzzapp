<?php

namespace App\Controller\Workers;

use App\Entity\Workers\TimeOff;
use App\Entity\Workers\WorkerRole;
use App\Form\Workers\TimeOffType;
use App\Form\Workers\WorkerRoleType;
use App\Repository\Property\SalonRolesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class WorkerRoleController extends AbstractController
{
    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
    }

    #[Route('/workers/schedule/{id}', name: 'app_worker_role', methods: ['POST'])]
    public function index(
        int                  $id,
        Request              $request,
        SalonRolesRepository $salonRolesRepository
    ): Response
    {
        $worker = $salonRolesRepository->findOneBy([
            'id' => $id,
            'role' => 'Worker'
        ]);

        if (!$worker) {
            throw $this->createNotFoundException('Worker not found or not a worker role');
        }

        $workerRole = $worker->getWorkerRole();
        if (!$workerRole) {
            $workerRole = new WorkerRole();
            $workerRole->setSalonRolesId($worker);
        }

        $form = $this->createForm(WorkerRoleType::class, $workerRole);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            try {
                if (!$workerRole->getId()) {
                    $workerRole->setCreatedAt(new \DateTimeImmutable());
                }
                $workerRole->setChangedAt(new \DateTimeImmutable());

                $this->entityManager->persist($workerRole);
                $this->entityManager->flush();

                return $this->json([
                    'success' => true,
                    'message' => 'Worker role created successfully',
                    'workerRoleId' => $workerRole->getId()
                ]);
            } catch (\Exception $e) {
                return $this->json([
                    'success' => false,
                    'message' => 'Failed to save worker role: ' . $e->getMessage(),
                ], 400);
            }
        } else {
            // Initialize errors array
            $errors = [];
            if ($form->isSubmitted()) {
                foreach ($form->getErrors(true) as $error) {
                    $errors[] = $error->getMessage();
                }
            }
            return $this->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $errors,
            ], 400);
        }
    }

    #[Route('/workers/timeoff/{id}', name: 'app_worker_timeoff', methods: ['POST'])]
    public function saveTimeOff(
        int $id,
        Request $request,
        SalonRolesRepository $salonRolesRepository
    ): Response
    {
        // Find the worker by ID and role
        $worker = $salonRolesRepository->findOneBy([
            'id' => $id,
            'role' => 'Worker'
        ]);

        if (!$worker) {
            throw $this->createNotFoundException('Worker not found or not a worker role');
        }

        // Create new TimeOff (assuming each request creates a new time off period)
        $timeOff = new TimeOff();

        $form = $this->createForm(TimeOffType::class, $timeOff);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            try {
                // Set timestamps
                $timeOff->setCreatedAt(new \DateTimeImmutable());
                $timeOff->setChangedAt(new \DateTimeImmutable());

                // If you need to associate this timeOff with the worker's WorkerRole
                $workerRole = $worker->getWorkerRole();
                $workerRole?->setTimeOff($timeOff);

                $this->entityManager->persist($timeOff);
                $this->entityManager->flush();

                return $this->json([
                    'success' => true,
                    'message' => 'Time off created successfully',
                    'timeOffId' => $timeOff->getId()
                ]);
            } catch (\Exception $e) {
                return $this->json([
                    'success' => false,
                    'message' => 'Failed to save time off: ' . $e->getMessage(),
                ], 400);
            }
        } else {
            // Handle form validation errors
            $errors = [];
            if ($form->isSubmitted()) {
                foreach ($form->getErrors(true) as $error) {
                    $errors[] = $error->getMessage();
                }
            }
            return $this->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $errors,
            ], 400);
        }
    }
}
