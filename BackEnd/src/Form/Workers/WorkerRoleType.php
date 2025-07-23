<?php

namespace App\Form\Workers;

use App\Entity\Workers\WorkerRole;
use App\Enum\WeekDaysEnum;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class WorkerRoleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('workDays', ChoiceType::class, [
                'choices' => WeekDaysEnum::cases(),
                'choice_label' => fn($choice) => $choice->name,
                'multiple' => true,
            ])
            ->add('startWorkTime', TimeType::class)
            ->add('endWorkTime', TimeType::class)
            ->add('startBreakTime', TimeType::class, [
                'required' => false,
            ])
            ->add('endBreakTime', TimeType::class, [
                'required' => false,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => WorkerRole::class,
            'csrf_protection' => false
        ]);
    }
}
