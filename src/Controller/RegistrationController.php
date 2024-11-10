<?php

namespace App\Controller;

use App\Entity\User;
use App\Event\UserRegisteredEvent;
use App\Form\RegistrationFormType;
use App\Security\AppAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class RegistrationController extends BaseController
{
    #[Route('/register', name: 'app_register')]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, Security $security, EntityManagerInterface $entityManager, EventDispatcherInterface $eventDispatcher): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var string $plainPassword */
            $plainPassword = $form->get('plainPassword')->getData();

            // encode the plain password
            $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));

            $file = $form->get('profilePicture')->getData();

            if ($file) {
                $uploadData = $this->uploadFile($file, 'profile_photos_directory', '/uploads/profiles');
                $user->setProfilePicture($uploadData['filename']);
            }


            // Dispatch the user.registered event
            $event = new UserRegisteredEvent($user);
            $eventDispatcher->dispatch($event);

            $entityManager->persist($user);
            $entityManager->flush();

            // do anything else you need here, like send an email

            return $security->login($user, AppAuthenticator::class, 'main');
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form,
        ]);
    }
}
