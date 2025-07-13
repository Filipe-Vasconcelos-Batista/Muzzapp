<?php

namespace App\Controller\Scheduling;

use App\Controller\Utils\UtilsController;
use App\Entity\Scheduling\Calendar;
use App\Entity\Workers\WorkerRole;
use DateInterval;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class CalendarController extends AbstractController
{
    public function __construct(
        private readonly UtilsController $utils,
        private readonly EntityManagerInterface $entityManager
    ) {}

    /**
     * @throws \Exception
     */
    #[Route('/calendar/open/{id}', name: 'app_schedule_calendar_create')]
    public function openCalendar(
        int $id,
        Request $request
    ): JsonResponse
    {
        $data=json_decode($request->getContent(), true);

        $startDate= new \DateTime($data['startDate']);
        $endDate= new \DateTime($data['endDate']);
        $interval= new DateInterval('PT' . $data['intervalMinutes'] . 'M');

        $workerRole=$this->entityManager->getRepository(WorkerRole::class)->findOneBy(['Id'=>$id]);

        $availableDays= array_map(fn($day)=>strtolower($day), $data['availableDays'] ?? []);
        $dailyBreaks= $data['dailyBreaks'] ?? [];
        $unavailableSlots=$data['unavailableSlots'] ?? [];
        $calendars=[];

        for ($date = clone $startDate; $date <= $endDate; $date->modify('+1 day')) {
            $dayName= strtolower($date->format('l'));
            if (!in_array($dayName, $availableDays)) {
                continue;
            }
            $startTime= new DateTime($date->format('Y-m-d') . ' '. $data['startTime']);
            $endTime= new DateTime($date->format('Y-m-d') . ' '. $data['endTime']);

            $slotTime= clone $startTime;
            $slotNumber=1;

            while($slotTime < $endTime){
                $skip=false;
                foreach($dailyBreaks as $break){
                    $breakStart = new DateTime($date->format('Y-m-d') . ' '. $break['from']);
                    $breakEnd = new DateTime($date->format('Y-m-d') . ' '. $break['to']);
                    if($slotTime>= $breakStart && $slotTime < $breakEnd){
                        $skip=true;
                        break;
                    }
                }
                foreach($unavailableSlots as $unavailable){
                    if($unavailable['date']!==$date->format('Y-m-d')){
                        continue;
                    }
                    $unavailStart = new DateTime($unavailable['date'] . ' ' . $unavailable['from']);
                    $unavailEnd = new DateTime($date->format('Y-m-d') . ' ' . $unavailable['to']);
                    if($slotTime>=$unavailStart && $slotTime < $unavailEnd){
                        $skip=true;
                        break;
                    }
                }
                if(!$skip){
                    $existing = $this->entityManager->getRepository(Calendar::class)->findOneBy([
                        'workerRoleId' => $workerRole,
                        'date' => $slotTime,
                    ]);

                    if ($existing) {
                        $slotTime->add($interval);
                        continue;
                    }

                    $calendar = new Calendar();
                    $calendar
                        ->setDate(clone $slotTime)
                        ->setWorkerRoleId($workerRole)
                        ->setSlotNumber($slotNumber++);

                    $this->entityManager->persist($calendar);
                    $calendars[] = $calendar;
                }
                $slotTime->add($interval);

            }
        }

        return new JsonResponse([
            'success' => true,
            'createdSlots' => count($calendars),
        ], 201);
    }
}
