<?php

namespace App\Form\Property;

use App\Entity\Property\Salon;
use App\Entity\Property\SalonRoles;
use App\Entity\User\User;
use App\Entity\Workers\WorkerRole;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SalonRolesType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('role')
            ->add('isActive')
            ->add('UserId', EntityType::class, [
                'class' => User::class,
                'choice_label' => 'id',
            ])
            ->add('salonId', EntityType::class, [
                'class' => Salon::class,
                'choice_label' => 'id',
            ])
            ->add('workerRole', EntityType::class, [
                'class' => WorkerRole::class,
                'choice_label' => 'id',
            ])
            ->add('createdAt', null, [
                'widget' => 'single_text',
            ])
            ->add('alteredAt', null, [
                'widget' => 'single_text',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => SalonRoles::class,
            'csrf_protection' => false
        ]);
    }
}
