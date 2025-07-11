<?php

namespace App\Form\Property;

use App\Entity\Property\Salon;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class SalonType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', textType::class,[
                'constraints' => [
                    new NotBlank([
                        'message' => 'Please enter your the salon name',
                    ]),
                    ]
                ]
            )
            ->add('phone', telType::class,[
                'required' => false,
            ])
            ->add('website', UrlType::class,[
                'required'=> false,
                'attr' => ['placeholder'=>'https://example.com']
            ] )
            ->add('email', EmailType::class )
            ->add('location',TextType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Salon::class,
        ]);
    }
}
