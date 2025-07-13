<?php

namespace App\Form\Scheduling;

use App\Entity\Scheduling\Calendar;
use App\Entity\Workers\WorkerRole;
use App\Enum\WeekDaysEnum;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\TypeInfo\Type\CollectionType;

class CalendarType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('startDate', DateType::class)
            ->add('endDate', DateType::class)
            ->add('workerRoleId', EntityType::class, [
                'class' => WorkerRole::class,
                'choice_label' => 'id',
            ])
            ->add('startTime', TimeType::class)
            ->add('endTime', TimeType::class)
            ->add('intervalMinutes', IntegerType::class)
            ->add('availableDays', ChoiceType::class,[
                'choices'=>WeekDaysEnum::cases(),
                'multiple'=>true,
                'expanded'=>true,
                'required'=>true
            ])
            ->add('dailyBreaks', CollectionType::class,[
                'entry_type'=> TimeSlotType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'required' => false,
            ])
            ->add('unavailableSlots', CollectionType::class,[
                'entry_type'=> UnavailableSlotType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'required' => false,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Calendar::class,
        ]);
    }
}
