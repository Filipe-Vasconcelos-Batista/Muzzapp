<?php

namespace App\Form\Workers;

use App\Entity\Workers\WorkerRole;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class WorkerRoleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('weeklySchedule', CollectionType::class, [
                'entry_type' => ScheduleDayType::class, // custom form for each day
                'allow_add' => true,
            ]);
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
