<?php

namespace App\Controller\Workers;

use App\Entity\Workers\TimeOff;
use App\Entity\Workers\WorkerRole;
use App\Enum\Worker\TimeOffStatusEnum;
use App\Repository\Property\SalonRolesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

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

        $data = json_decode($request->getContent(), true);

        if (!isset($data['weeklySchedule']) || !is_array($data['weeklySchedule'])) {
            return $this->json([
                'success' => false,
                'message' => 'weeklySchedule is required and must be an object/array',
            ], 400);
        }

        $workerRole->setWeeklySchedule($data['weeklySchedule']);

        try{
            if(!$workerRole->getId()){
                $workerRole->setCreatedAt(new \DateTimeImmutable());
            }
            $workerRole->setChangedAt(new \DateTimeImmutable());

            $this->entityManager->persist($workerRole);
            $this->entityManager->flush();
            return $this->json([
                'success'=>true,
                'message' => 'worker schedule saved successfully',
                'workerRoleId' => $workerRole->getId()
            ]);
        }catch(\Exception $e){
            return $this->json([
                'success'=> false,
                'message' => 'Failed to save worker role: ' . $e->getMessage(),
            ],400);
        }
    }

    /**
     * @throws \Exception
     */
    #[Route('/workers/timeoff/{id}', name: 'app_worker_timeoff', methods: ['POST'])]
    public function saveTimeOff(
        int $id,
        Request $request,
        SalonRolesRepository $salonRolesRepository,
        ValidatorInterface $validator
    ): Response
    {
        // Find the worker by ID and role
        $worker = $salonRolesRepository->findOneBy([
            'id' => $id,
            'role' => 'Worker'
        ]);

        if (!$worker) {
            return $this->json([
                'success' => false,
                'message' => 'Worker not found or not a worker role'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json([
                'success' => false,
                'message' => 'Invalid JSON.'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Create new TimeOff (assuming each request creates a new time off period)
        $timeOff = new TimeOff();

        if (!empty($data['start'])){
            $timeOff->setStart(new \DateTime($data['start']));
        }
        if (!empty($data['end'])) {
            $timeOff->setEnd(new \DateTime($data['end']));
        }
        if (!empty($data['reason'])) {
            $timeOff->setReason($data['reason']);
        }

        $timeOff->setStatus(TimeOffStatusEnum::Pending);

        $timeOff->setCreatedAt(new \DateTimeImmutable());
        $timeOff->setChangedAt(new \DateTimeImmutable());

        $workerRole = $worker->getWorkerRole();
        $workerRole?->setTimeOff($timeOff);

        $errors = $validator->validate($timeOff);
        if (count($errors) > 0) {
            return $this->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => array_map(fn($e) => $e->getMessage(), iterator_to_array($errors)),
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
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
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
